
import json
import base64
import time

def create_dummy_jwt():
    header = {"alg": "HS512", "typ": "JWT"}
    payload = {
        "exp": int(time.time() + 3600),
        "sub": "testuser",
        "role": "USER",
        "iat": int(time.time())
    }

    def encode(data):
        return base64.urlsafe_b64encode(json.dumps(data).encode()).decode().rstrip('=')

    return f"{encode(header)}.{encode(payload)}.dummy_signature"

from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Create dummy token
    token = create_dummy_jwt()
    user = {
        "userId": 1,
        "username": "testuser",
        "email": "test@example.com",
        "role": "USER"
    }

    # Set up route interception for orders
    def handle_orders(route):
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps([
                {
                    "id": 1,
                    "totalPrice": 5000,
                    "status": "DELIVERED",
                    "createdAt": "2023-10-26T12:00:00",
                    "items": []
                },
                {
                    "id": 2,
                    "totalPrice": 3000,
                    "status": "PENDING",
                    "createdAt": "2023-10-27T12:00:00",
                    "items": []
                }
            ])
        )

    def handle_delete(route):
        route.fulfill(status=204)

    page.route("**/api/orders/user/1", handle_orders)
    page.route("**/api/orders/1", handle_delete)

    # Set local storage before navigating
    # We navigate to a blank page first to set local storage for the domain
    page.goto("http://localhost:5173/")

    page.evaluate(f"""() => {{
        localStorage.setItem('token', '{token}');
        localStorage.setItem('user', '{json.dumps(user)}');
    }}""")

    # Navigate to Profile Page
    page.goto("http://localhost:5173/profile")

    # Verify orders are visible
    expect(page.get_by_text("Rendelés #1")).to_be_visible()
    expect(page.get_by_text("Rendelés #2")).to_be_visible()

    # Verify Delete button is visible for Order #1 (DELIVERED)
    # Finding the button specifically within the order card 1
    # We can look for the button with text "Törlés" near "Rendelés #1" or verify count
    delete_buttons = page.get_by_role("button", name="Törlés")
    expect(delete_buttons).to_have_count(1)

    # Verify Delete button is NOT visible for Order #2 (PENDING)
    # We know there is only 1 delete button, and it should be associated with the delivered order.

    # Click delete
    # Handle dialog
    page.on("dialog", lambda dialog: dialog.accept())
    delete_buttons.first.click()

    # Verify Order #1 is removed
    expect(page.get_by_text("Rendelés #1")).not_to_be_visible()

    # Take screenshot
    page.screenshot(path="verification/profile_page_delete_test.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
