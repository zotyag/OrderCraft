package com.gombar.OrderCraft;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrderCraftApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderCraftApplication.class, args);
        System.out.println("OrderCraft Backend started successfully!");
    }
}
