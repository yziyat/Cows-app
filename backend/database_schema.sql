-- ============================================
-- SCHÉMA BASE DE DONNÉES - GESTION BOVINS
-- ============================================

-- Table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'editor', 'viewer')) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des bovins
CREATE TABLE cattle (
    id SERIAL PRIMARY KEY,
    ear_tag VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    breed VARCHAR(100),
    birth_date DATE,
    sex VARCHAR(10) CHECK (sex IN ('male', 'female')),
    status VARCHAR(20) CHECK (status IN ('active', 'sold', 'deceased', 'culled')) DEFAULT 'active',
    mother_id INTEGER REFERENCES cattle(id),
    father_id INTEGER REFERENCES cattle(id),
    weight DECIMAL(6,2),
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des protocoles de synchronisation
CREATE TABLE synchronization_protocols (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des étapes du protocole
CREATE TABLE protocol_steps (
    id SERIAL PRIMARY KEY,
    protocol_id INTEGER REFERENCES synchronization_protocols(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    action VARCHAR(100) NOT NULL,
    product VARCHAR(100),
    dosage VARCHAR(100),
    notes TEXT,
    UNIQUE(protocol_id, step_number)
);

-- Table des cycles de synchronisation (application du protocole)
CREATE TABLE synchronization_cycles (
    id SERIAL PRIMARY KEY,
    cattle_id INTEGER REFERENCES cattle(id),
    protocol_id INTEGER REFERENCES synchronization_protocols(id),
    start_date DATE NOT NULL,
    expected_heat_date DATE,
    status VARCHAR(20) CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'planned',
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des actions réalisées dans le cycle
CREATE TABLE cycle_actions (
    id SERIAL PRIMARY KEY,
    cycle_id INTEGER REFERENCES synchronization_cycles(id) ON DELETE CASCADE,
    step_id INTEGER REFERENCES protocol_steps(id),
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    is_completed BOOLEAN DEFAULT false,
    performed_by INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des chaleurs observées
CREATE TABLE heat_observations (
    id SERIAL PRIMARY KEY,
    cattle_id INTEGER REFERENCES cattle(id),
    observation_date TIMESTAMP NOT NULL,
    intensity VARCHAR(20) CHECK (intensity IN ('low', 'medium', 'high')),
    cycle_id INTEGER REFERENCES synchronization_cycles(id),
    notes TEXT,
    observed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des inséminations
CREATE TABLE inseminations (
    id SERIAL PRIMARY KEY,
    cattle_id INTEGER REFERENCES cattle(id),
    insemination_date DATE NOT NULL,
    heat_observation_id INTEGER REFERENCES heat_observations(id),
    cycle_id INTEGER REFERENCES synchronization_cycles(id),
    bull_name VARCHAR(100),
    bull_registration VARCHAR(100),
    technician_name VARCHAR(100),
    straw_number VARCHAR(100),
    result VARCHAR(20) CHECK (result IN ('pending', 'pregnant', 'open', 'aborted')),
    pregnancy_check_date DATE,
    expected_calving_date DATE,
    notes TEXT,
    performed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des vêlages
CREATE TABLE calvings (
    id SERIAL PRIMARY KEY,
    cattle_id INTEGER REFERENCES cattle(id),
    insemination_id INTEGER REFERENCES inseminations(id),
    calving_date DATE NOT NULL,
    calf_id INTEGER REFERENCES cattle(id),
    calving_ease VARCHAR(20) CHECK (calving_ease IN ('easy', 'assisted', 'difficult', 'cesarean')),
    calf_status VARCHAR(20) CHECK (calf_status IN ('alive', 'dead', 'stillborn')),
    notes TEXT,
    recorded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des alertes/notifications
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL,
    cattle_id INTEGER REFERENCES cattle(id),
    cycle_id INTEGER REFERENCES synchronization_cycles(id),
    insemination_id INTEGER REFERENCES inseminations(id),
    message TEXT NOT NULL,
    alert_date DATE NOT NULL,
    is_read BOOLEAN DEFAULT false,
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des logs d'activité
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEX pour optimiser les performances
-- ============================================

CREATE INDEX idx_cattle_ear_tag ON cattle(ear_tag);
CREATE INDEX idx_cattle_status ON cattle(status);
CREATE INDEX idx_cattle_sex ON cattle(sex);
CREATE INDEX idx_sync_cycles_cattle ON synchronization_cycles(cattle_id);
CREATE INDEX idx_sync_cycles_status ON synchronization_cycles(status);
CREATE INDEX idx_sync_cycles_dates ON synchronization_cycles(start_date, expected_heat_date);
CREATE INDEX idx_cycle_actions_cycle ON cycle_actions(cycle_id);
CREATE INDEX idx_cycle_actions_date ON cycle_actions(scheduled_date);
CREATE INDEX idx_inseminations_cattle ON inseminations(cattle_id);
CREATE INDEX idx_inseminations_date ON inseminations(insemination_date);
CREATE INDEX idx_inseminations_result ON inseminations(result);
CREATE INDEX idx_heat_obs_cattle ON heat_observations(cattle_id);
CREATE INDEX idx_heat_obs_date ON heat_observations(observation_date);
CREATE INDEX idx_alerts_date ON alerts(alert_date, is_read);
CREATE INDEX idx_alerts_cattle ON alerts(cattle_id);

-- ============================================
-- FONCTIONS TRIGGER pour updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cattle_updated_at BEFORE UPDATE ON cattle
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocols_updated_at BEFORE UPDATE ON synchronization_protocols
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cycles_updated_at BEFORE UPDATE ON synchronization_cycles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inseminations_updated_at BEFORE UPDATE ON inseminations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DONNÉES INITIALES
-- ============================================

-- Utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO users (username, email, password_hash, role, first_name, last_name) 
VALUES ('admin', 'admin@farm.com', '$2a$10$rKZvVxQ6V8Y9wJxZhx4VR.X5xqXGqKW9EwPxKqJxQKJxQKJxQKJxQ', 'admin', 'Admin', 'System');

-- Protocole Ovsynch standard
INSERT INTO synchronization_protocols (name, description, duration_days, created_by)
VALUES ('Ovsynch Standard', 'Protocole Ovsynch classique pour synchronisation des chaleurs', 10, 1);

-- Étapes du protocole Ovsynch
INSERT INTO protocol_steps (protocol_id, step_number, day_number, action, product, dosage, notes)
VALUES 
(1, 1, 0, 'Injection GnRH', 'GnRH', '100 μg', 'Première injection de GnRH'),
(1, 2, 7, 'Injection PGF2α', 'Prostaglandine', '25 mg', 'Injection de prostaglandine'),
(1, 3, 9, 'Injection GnRH', 'GnRH', '100 μg', 'Deuxième injection de GnRH'),
(1, 4, 10, 'Insémination', '', '', 'Insémination artificielle 16-20h après dernière GnRH');
