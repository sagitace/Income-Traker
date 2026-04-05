-- Income Tracker Database Schema
-- PostgreSQL v14+

-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ============================================================================
-- IPON SETTINGS TABLE
-- Settings for calculating savings and emergency fund percentages
-- ============================================================================
CREATE TABLE ipon_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    savings_percentage NUMERIC(5, 2) NOT NULL DEFAULT 20.00,
    emergency_percentage NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint: percentages should be between 0 and 100
    CONSTRAINT check_savings_percentage CHECK (savings_percentage >= 0 AND savings_percentage <= 100),
    CONSTRAINT check_emergency_percentage CHECK (emergency_percentage >= 0 AND emergency_percentage <= 100)
);

CREATE INDEX idx_ipon_settings_user_id ON ipon_settings(user_id);

-- ============================================================================
-- INCOME TABLE
-- Core income records with pre-calculated savings and emergency amounts
-- ============================================================================
CREATE TABLE income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    savings_amount NUMERIC(12, 2) NOT NULL,
    emergency_amount NUMERIC(12, 2) NOT NULL,
    source VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    day INT NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint: amounts must be non-negative
    CONSTRAINT check_amounts_positive CHECK (amount >= 0 AND savings_amount >= 0 AND emergency_amount >= 0),
    -- Constraint: year, month, day must be valid ranges
    CONSTRAINT check_year CHECK (year >= 2020 AND year <= 2099),
    CONSTRAINT check_month CHECK (month >= 1 AND month <= 12),
    CONSTRAINT check_day CHECK (day >= 1 AND day <= 31)
);

CREATE INDEX idx_income_user_id ON income(user_id);
CREATE INDEX idx_income_date ON income(date);
CREATE INDEX idx_income_user_date ON income(user_id, date);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp on users
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Update updated_at timestamp on ipon_settings
CREATE OR REPLACE FUNCTION update_ipon_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ipon_settings_updated_at
BEFORE UPDATE ON ipon_settings
FOR EACH ROW
EXECUTE FUNCTION update_ipon_settings_updated_at();

-- Update updated_at timestamp on income
CREATE OR REPLACE FUNCTION update_income_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_income_updated_at
BEFORE UPDATE ON income
FOR EACH ROW
EXECUTE FUNCTION update_income_updated_at();
