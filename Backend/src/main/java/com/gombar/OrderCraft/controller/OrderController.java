package com.gombar.OrderCraft.controller;


import com.gombar.OrderCraft.dto.OrderDTO;
import com.gombar.OrderCraft.model.Order;
import com.gombar.OrderCraft.model.User;
import com.gombar.OrderCraft.service.OrderService;
import com.gombar.OrderCraft.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
        import java.util.List;

@RestController
@RequestMapping("api/orders")
//@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    // GET all orders (ADMIN only)
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // GET user's orders
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId,
                                                     @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            User user = userService.getUserById(userId);
            List<Order> orders = orderService.getUserOrders(user);
            return ResponseEntity.ok(orders);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET single order by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET orders by status (ADMIN only)
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status,
                                               @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (!isAdmin(authHeader)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can view orders by status");
            }
            Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            List<Order> orders = orderService.getOrdersByStatus(orderStatus);
            return ResponseEntity.ok(orders);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // CREATE new order
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            Order created = orderService.createOrder(order);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE order (ADMIN only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id,
                                         @RequestBody Order order,
                                         @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (!isAdmin(authHeader)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can update orders");
            }
            Order updated = orderService.updateOrder(id, order);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // UPDATE order status (ADMIN only) - Real-time status tracking
    @PatchMapping("/{id}/status/{newStatus}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id,
                                               @PathVariable String newStatus,
                                               @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (!isAdmin(authHeader)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can update order status");
            }
            Order.OrderStatus status = Order.OrderStatus.valueOf(newStatus.toUpperCase());
            Order updated = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DELETE order (ADMIN only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id,
                                         @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (!isAdmin(authHeader)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can delete orders");
            }
            orderService.deleteOrder(id);
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