package com.gombar.OrderCraft.repository;

import com.gombar.OrderCraft.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategory(MenuItem.Category category);
    List<MenuItem> findByAvailableTrue();
    List<MenuItem> findByCategoryAndAvailableTrue(MenuItem.Category category);
    List<MenuItem> findAllByOrderByOrderCountDesc();
}