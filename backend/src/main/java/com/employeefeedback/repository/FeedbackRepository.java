package com.employeefeedback.repository;

import com.employeefeedback.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);

    List<Feedback> findAllByOrderByCreatedAtDesc();

    long countByEmployeeId(Long employeeId);

    long countBySentiment(String sentiment);

    long countByUrgency(String urgency);

    @Query("SELECT f.sentiment, COUNT(f) FROM Feedback f GROUP BY f.sentiment")
    List<Object[]> countBySentimentGroup();

    @Query("SELECT f.department, COUNT(f) FROM Feedback f GROUP BY f.department")
    List<Object[]> countByDepartmentGroup();

    @Query("SELECT f.urgency, COUNT(f) FROM Feedback f GROUP BY f.urgency")
    List<Object[]> countByUrgencyGroup();

    @Query("SELECT f.topic, COUNT(f) FROM Feedback f GROUP BY f.topic")
    List<Object[]> countByTopicGroup();

    @Query("SELECT f.keyConcern, COUNT(f) FROM Feedback f WHERE f.keyConcern IS NOT NULL AND f.keyConcern != '' GROUP BY f.keyConcern ORDER BY COUNT(f) DESC")
    List<Object[]> findTopKeyConcerns();
}
