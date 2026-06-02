CREATE TABLE IF NOT EXISTS cases (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_number VARCHAR(64) NOT NULL,
  adverse_record_id VARCHAR(128) NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status ENUM('Reported','Under Review','Investigation','Action Required','Resolved','Closed') NOT NULL DEFAULT 'Reported',
  severity ENUM('Low','Medium','High','Critical') NOT NULL DEFAULT 'Low',
  assigned_to BIGINT UNSIGNED NULL,
  reported_by BIGINT UNSIGNED NOT NULL,
  reported_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_review_at DATETIME NULL,
  resolved_at DATETIME NULL,
  closed_at DATETIME NULL,
  is_sla_breached TINYINT(1) NOT NULL DEFAULT 0,
  escalation_level INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_cases_case_number (case_number),
  KEY idx_cases_status_assignee_sla (status, assigned_to, is_sla_breached),
  KEY idx_cases_due_review_at (due_review_at),
  CONSTRAINT fk_cases_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_cases_reported_by FOREIGN KEY (reported_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS case_status_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_id BIGINT UNSIGNED NOT NULL,
  from_status VARCHAR(64) NULL,
  to_status VARCHAR(64) NOT NULL,
  changed_by BIGINT UNSIGNED NOT NULL,
  reason TEXT NULL,
  changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_case_status_history_case_id (case_id),
  KEY idx_case_status_history_changed_at (changed_at),
  CONSTRAINT fk_case_status_history_case_id FOREIGN KEY (case_id) REFERENCES cases(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_case_status_history_changed_by FOREIGN KEY (changed_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS case_assignments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_id BIGINT UNSIGNED NOT NULL,
  assigned_to BIGINT UNSIGNED NOT NULL,
  assigned_by BIGINT UNSIGNED NOT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unassigned_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_case_assignments_case_id (case_id),
  KEY idx_case_assignments_assigned_to (assigned_to),
  CONSTRAINT fk_case_assignments_case_id FOREIGN KEY (case_id) REFERENCES cases(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_case_assignments_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_case_assignments_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS case_notes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_id BIGINT UNSIGNED NOT NULL,
  note_body TEXT NOT NULL,
  is_internal TINYINT(1) NOT NULL DEFAULT 1,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_case_notes_case_id (case_id),
  KEY idx_case_notes_created_at (created_at),
  CONSTRAINT fk_case_notes_case_id FOREIGN KEY (case_id) REFERENCES cases(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_case_notes_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS case_escalations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_id BIGINT UNSIGNED NOT NULL,
  rule_name VARCHAR(128) NOT NULL,
  trigger_type VARCHAR(64) NOT NULL,
  escalated_to_role VARCHAR(64) NOT NULL DEFAULT 'manager',
  escalated_to_user_id BIGINT UNSIGNED NULL,
  escalation_level INT NOT NULL DEFAULT 1,
  triggered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_case_escalations_case_id (case_id),
  KEY idx_case_escalations_triggered_at (triggered_at),
  CONSTRAINT fk_case_escalations_case_id FOREIGN KEY (case_id) REFERENCES cases(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_case_escalations_user_id FOREIGN KEY (escalated_to_user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
);
