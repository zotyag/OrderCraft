package com.gombar.OrderCraft.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // <--- FONTOS IMPORT
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Data // Ez generálja a setOrder-t az új mezőhöz!
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double priceAtOrder;

    // --- EZ HIÁNYZOTT! ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id") // Ez hozza létre a kapcsolatot adatbázis szinten
    @JsonIgnore // Megakadályozza a végtelen ciklust JSON generáláskor
    private Order order;
    // ---------------------

    public Double getSubtotal() {
        if (priceAtOrder == null || quantity == null) {
            return 0.0;
        }
        return priceAtOrder * quantity;
    }
}