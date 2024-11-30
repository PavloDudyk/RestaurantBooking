package com.restaurantbooking.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tables") // Це стосується JPA-таблиці, а не вашого класу
@Data
public class RestaurantTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tableId;

    private int capacity;
    private String location;
}