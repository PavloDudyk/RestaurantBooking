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

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/reservations")
public class AdminController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private GuestRepository guestRepository;

    // Отримати всі бронювання
    @GetMapping
    public ResponseEntity<?> getAllReservations() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }

    // Додати нове бронювання
    @PostMapping
    public ResponseEntity<?> addReservation(@RequestBody ReservationRequest request) {
        Optional<RestaurantTable> tableOptional = tableRepository.findById((long) request.getTableNumber());

        if (tableOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Table not found.");
        }

        Guest guest = new Guest();
        guest.setFullName(request.getFullName());
        guest.setPhoneNumber(request.getPhoneNumber());
        guest.setEmail(request.getEmail());
        guest.setTelegramId(request.getTelegramId());
        guest.setAllergens(request.getAllergens());
        guest = guestRepository.save(guest);

        Reservation reservation = new Reservation();
        reservation.setGuest(guest);
        reservation.setTable(tableOptional.get());
        reservation.setReservationDate(request.getReservationDate());
        reservation.setReservationTime(request.getReservationTime());
        reservation.setGuestCount(request.getGuestCount());
        reservationRepository.save(reservation);

        return ResponseEntity.ok("Reservation added successfully.");
    }

    // Оновити бронювання
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable Long id, @RequestBody ReservationRequest request) {
        Optional<Reservation> reservationOptional = reservationRepository.findById(id);

        if (reservationOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Reservation not found.");
        }

        Reservation reservation = reservationOptional.get();
        Guest guest = reservation.getGuest();
        guest.setFullName(request.getFullName());
        guest.setPhoneNumber(request.getPhoneNumber());
        guest.setEmail(request.getEmail());
        guest.setTelegramId(request.getTelegramId());
        guest.setAllergens(request.getAllergens());
        guestRepository.save(guest);

        Optional<RestaurantTable> tableOptional = tableRepository.findById((long) request.getTableNumber());
        if (tableOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Table not found.");
        }

        reservation.setTable(tableOptional.get());
        reservation.setReservationDate(request.getReservationDate());
        reservation.setReservationTime(request.getReservationTime());
        reservation.setGuestCount(request.getGuestCount());
        reservationRepository.save(reservation);

        return ResponseEntity.ok("Reservation updated successfully.");
    }

    // Видалити бронювання
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        Optional<Reservation> reservationOptional = reservationRepository.findById(id);

        if (reservationOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Reservation not found.");
        }

        Reservation reservation = reservationOptional.get();
        reservationRepository.delete(reservation);
        guestRepository.delete(reservation.getGuest());

        return ResponseEntity.ok("Reservation deleted successfully.");
    }
}
