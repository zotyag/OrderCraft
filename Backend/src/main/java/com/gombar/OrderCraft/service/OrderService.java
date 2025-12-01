package com.gombar.OrderCraft.service;

import com.gombar.OrderCraft.model.Order;
import com.gombar.OrderCraft.model.OrderItem;
import com.gombar.OrderCraft.model.MenuItem;
import com.gombar.OrderCraft.model.User;
import com.gombar.OrderCraft.repository.OrderRepository;
import com.gombar.OrderCraft.repository.MenuItemRepository; // <--- EZT IMPORTÁLD!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <--- Javasolt import

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuItemRepository menuRepository; // <--- EZ ÚJ: Kell az árak lekéréséhez

    @Autowired
    private MenuService menuService;

    // CRUD Operations
    @Transactional // Fontos: ha hiba van, visszaállít mindent
    public Order createOrder(Order order) {
        double totalPrice = 0;

        // Végigmegyünk a tételeken, amiket a frontend küldött
        for (OrderItem item : order.getItems()) {

            // 1. Megkeressük a valódi terméket az ID alapján (az adatbázisból)
            // A frontend csak ennyit küld: menuItem: { id: 1 }
            MenuItem realMenuItem = menuRepository.findById(item.getMenuItem().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu item not found with id: " + item.getMenuItem().getId()));

            // 2. Beállítjuk a hiányzó adatokat
            item.setMenuItem(realMenuItem); // Kicseréljük a "üres" objektumot a valódira
            item.setPriceAtOrder(realMenuItem.getPrice()); // <--- A HIBA ITT VOLT: Beállítjuk az aktuális árat
            item.setOrder(order); // Beállítjuk a szülő-gyerek kapcsolatot (JPA miatt kell)

            // 3. Számolunk
            // (Most már nem lesz null pointer exception, mert beállítottuk az árat)
            totalPrice += realMenuItem.getPrice() * item.getQuantity();

            // Increment order count for popular items ranking
            menuService.incrementOrderCount(realMenuItem);
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