package com.restaurantbooking.controller;

import com.restaurantbooking.dto.ReservationRequest;
import com.restaurantbooking.model.Guest;
import com.restaurantbooking.model.Reservation;
import com.restaurantbooking.model.RestaurantTable;
import com.restaurantbooking.repository.GuestRepository;
import com.restaurantbooking.repository.ReservationRepository;
import com.restaurantbooking.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private TableRepository tableRepository;
    @Autowired
    private GuestRepository guestRepository;

    @PostMapping
    public ResponseEntity<String> createReservation(@RequestBody ReservationRequest request) {
        // Перевірка наявності столика
        RestaurantTable table = tableRepository.findById((long) request.getTableNumber())
                .orElseThrow(() -> new RuntimeException("Столик не знайдено!"));

        // Створення або пошук гостя
        Guest guest = new Guest();
        guest.setFullName(request.getFullName());
        guest.setPhoneNumber(request.getPhoneNumber());
        guest.setEmail(request.getEmail());
        guest.setTelegramId(request.getTelegramId());
        guest.setAllergens(request.getAllergens());
        guest = guestRepository.save(guest);

        // Створення бронювання
        Reservation reservation = new Reservation();
        reservation.setTable(table);
        reservation.setGuest(guest);
        reservation.setReservationDate(request.getReservationDate());
        reservation.setReservationTime(request.getReservationTime());
        //reservation.setGuestCount(request.getNumberOfGuests());
        reservationRepository.save(reservation);

        return ResponseEntity.ok("Бронювання успішно створено.");
    }

}