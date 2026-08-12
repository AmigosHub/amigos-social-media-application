package com.socialmedia.config;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for ModelMapper bean.
 * Configures ModelMapper with strict matching strategy and lazy loading support.
 */
@Configuration
public class ModelMapperConfig {

    /**
     * Creates and configures a ModelMapper bean.
     * Features:
     * - Strict matching strategy for precise field mapping
     * - Skip null values during mapping
     * - Ignore ambiguous mapping conflicts
     * - Enable field matching
     * - Skip uninitialized Hibernate proxies and collections
     * 
     * @return Configured ModelMapper instance
     */
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        
        // Configure basic ModelMapper settings
        mapper.getConfiguration()
            .setMatchingStrategy(MatchingStrategies.STRICT)  // Use strict matching for field names
            .setPropertyCondition(Conditions.isNotNull())    // Skip null source values
            .setSkipNullEnabled(true)                        // Don't map null values
            .setAmbiguityIgnored(true)                       // Ignore ambiguous mappings
            .setFieldMatchingEnabled(true);                  // Enable field-level matching
        
        // Configure property condition to handle lazy loading
        mapper.getConfiguration().setPropertyCondition(context -> {
            try {
                Object source = context.getSource();
                if (source == null) return false;           // Skip null values
                
                // Check if it's a Hibernate proxy (lazy-loaded entity)
                if (source instanceof org.hibernate.proxy.HibernateProxy) {
                    return org.hibernate.Hibernate.isInitialized(source);
                }
                
                // Check if it's a PersistentCollection (lazy-loaded collection)
                if (source instanceof org.hibernate.collection.spi.PersistentCollection) {
                    return ((org.hibernate.collection.spi.PersistentCollection) source).wasInitialized();
                }
                
                return true;  // Allow mapping for initialized objects
            } catch (Exception e) {
                return false;  // Skip mapping if any exception occurs
            }
        });
        
        return mapper;
    }
}