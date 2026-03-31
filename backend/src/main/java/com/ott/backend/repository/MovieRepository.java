package com.ott.backend.repository;

import com.ott.backend.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    @Query("SELECT m FROM Movie m WHERE " +
           "(:search IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(m.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:genre IS NULL OR LOWER(m.genre) = LOWER(:genre)) AND " +
           "(:year IS NULL OR m.releaseYear = :year)")
    List<Movie> findWithFilters(@Param("search") String search,
                                @Param("genre") String genre,
                                @Param("year") Integer year);
}
