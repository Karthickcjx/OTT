package com.ott.backend.repository;

import com.ott.backend.entity.Series;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeriesRepository extends JpaRepository<Series, Long> {

    @Query("SELECT s FROM Series s WHERE " +
           "(:search IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:genre IS NULL OR LOWER(s.genre) = LOWER(:genre)) AND " +
           "(:year IS NULL OR s.releaseYear = :year)")
    List<Series> findWithFilters(@Param("search") String search,
                                 @Param("genre") String genre,
                                 @Param("year") Integer year);
}
