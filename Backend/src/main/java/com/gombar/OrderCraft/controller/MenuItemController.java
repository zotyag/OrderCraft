package com.gombar.OrderCraft.controller;


import com.gombar.OrderCraft.model.MenuItem;
import com.gombar.OrderCraft.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/menu")
@CrossOrigin(origins = "http://localhost:3000")
public class MenuItemController {

    @Autowired
    private MenuService menuService;

    // GET all menu items
    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        List<MenuItem> items = menuService.getAllMenuItems();
        return ResponseEntity.ok(items);
    }

    // GET available menu items only
    @GetMapping("/available")
    public ResponseEntity<List<MenuItem>> getAvailableMenuItems() {
        List<MenuItem> items = menuService.getAvailableMenuItems();
        return ResponseEntity.ok(items);
    }

    // GET menu items by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByCategory(@PathVariable String category) {
        try {
            MenuItem.Category cat = MenuItem.Category.valueOf(category.toUpperCase());
            List<MenuItem> items = menuService.getMenuItemsByCategory(cat);
            return ResponseEntity.ok(items);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // GET popular menu items (ranked by order count)
    @GetMapping("/popular")
    public ResponseEntity<List<MenuItem>> getPopularMenuItems() {
        List<MenuItem> items = menuService.getPopularMenuItems();
        return ResponseEntity.ok(items);
    }

    // GET single menu item by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getMenuItemById(@PathVariable Long id) {
        return menuService.getMenuItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE new menu item (ADMIN only)
    @PostMapping
    public ResponseEntity<?> createMenuItem(@RequestBody MenuItem menuItem,
                                            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (!isAdmin(authHeader)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can create menu items");
            }
            MenuItem created = menuService.createMenuItem(menuItem);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE menu item (ADMIN only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenuItem(@PathVariable Long id,
                                            @RequestBody MenuItem menuItem,
                                            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (!isAdmin(authHeader)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can update menu items");
            }
            MenuItem updated = menuService.updateMenuItem(id, menuItem);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE menu item (ADMIN only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id,
                                            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (!isAdmin(authHeader)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can delete menu items");
            }
            menuService.deleteMenuItem(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private boolean isAdmin(String authHeader) {
        // Simplified check - in production, properly validate the JWT token
        return authHeader != null && authHeader.contains("Bearer");
    }
}
