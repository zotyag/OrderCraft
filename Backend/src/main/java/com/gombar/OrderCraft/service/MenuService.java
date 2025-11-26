package com.gombar.OrderCraft.service;

import com.gombar.OrderCraft.model.MenuItem;
import com.gombar.OrderCraft.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    // CRUD Operations
    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public Optional<MenuItem> getMenuItemById(Long id) {
        return menuItemRepository.findById(id);
    }

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public MenuItem updateMenuItem(Long id, MenuItem menuItem) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("MenuItem not found with id: " + id));

        if (menuItem.getName() != null) existing.setName(menuItem.getName());
        if (menuItem.getDescription() != null) existing.setDescription(menuItem.getDescription());
        if (menuItem.getPrice() != null) existing.setPrice(menuItem.getPrice());
        if (menuItem.getCategory() != null) existing.setCategory(menuItem.getCategory());
        if (menuItem.getAvailable() != null) existing.setAvailable(menuItem.getAvailable());

        return menuItemRepository.save(existing);
    }

    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }

    // Filtering and Sorting
    public List<MenuItem> getMenuItemsByCategory(MenuItem.Category category) {
        return menuItemRepository.findByCategoryAndAvailableTrue(category);
    }

    public List<MenuItem> getAvailableMenuItems() {
        return menuItemRepository.findByAvailableTrue();
    }

    // Extra Business Logic
    public List<MenuItem> getPopularMenuItems() {
        return menuItemRepository.findAllByOrderByOrderCountDesc();
    }

    public MenuItem incrementOrderCount(MenuItem menuItem) {
        menuItem.setOrderCount(menuItem.getOrderCount() + 1);
        return menuItemRepository.save(menuItem);
    }
}