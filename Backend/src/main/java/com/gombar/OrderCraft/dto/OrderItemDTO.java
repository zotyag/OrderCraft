package com.gombar.OrderCraft.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private Integer quantity;
    private Double priceAtOrder;
    private Double subtotal;
}
