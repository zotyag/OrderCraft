package com.gombar.OrderCraft.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private Long userId;
    private String username;
    private List<OrderItemDTO> items;
    private Double totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private String paymentMethod;
    private String notes;
}
