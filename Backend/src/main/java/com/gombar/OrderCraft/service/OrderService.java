package com.gombar.OrderCraft.service;

import com.gombar.OrderCraft.model.Order;
import com.gombar.OrderCraft.model.OrderItem;
import com.gombar.OrderCraft.model.MenuItem;
import com.gombar.OrderCraft.model.User;
import com.gombar.OrderCraft.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuService menuService;

    // CRUD Operations
    public Order createOrder(Order order) {
        // Calculate total price
        double totalPrice = 0;
        for (OrderItem item : order.getItems()) {
            totalPrice += item.getSubtotal();
            // Increment order count for popular items ranking
            MenuItem menuItem = item.getMenuItem();
            menuService.incrementOrderCount(menuItem);
        }
        order.setTotalPrice(totalPrice);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateOrder(Long id, Order orderUpdates) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));

        if (orderUpdates.getStatus() != null) {
            existing.setStatus(orderUpdates.getStatus());
            if (orderUpdates.getStatus() == Order.OrderStatus.DELIVERED) {
                existing.setCompletedAt(LocalDateTime.now());
            }
        }
        if (orderUpdates.getNotes() != null) existing.setNotes(orderUpdates.getNotes());

        return orderRepository.save(existing);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // User-specific operations
    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // Admin operations
    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    public Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(newStatus);
        if (newStatus == Order.OrderStatus.DELIVERED) {
            order.setCompletedAt(LocalDateTime.now());
        }
        return orderRepository.save(order);
    }
}