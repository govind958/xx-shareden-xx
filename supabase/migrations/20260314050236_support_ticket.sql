CREATE TYPE ticket_category AS ENUM ('technical', 'billing', 'account', 'feature', 'other');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY, -- or UUID
    user_id INTEGER NOT NULL, -- FOREIGN KEY REFERENCES users(id)
    subject VARCHAR(255) NOT NULL,
    category ticket_category NOT NULL DEFAULT 'technical',
    priority ticket_priority NOT NULL DEFAULT 'medium',
    description TEXT NOT NULL,
    attachment_url VARCHAR(255),
    status ticket_status NOT NULL DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
