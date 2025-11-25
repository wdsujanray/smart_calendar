// Advanced Calendar Features
class AdvancedCalendar {
    constructor() {
        this.view = 'month';
        this.selectedEvents = new Set();
        this.filters = {
            categories: new Set(),
            priorities: new Set(),
            dateRange: null
        };
    }

    init() {
        this.setupAdvancedFeatures();
        this.setupEventFiltering();
        this.setupDragAndDrop();
    }

    setupAdvancedFeatures() {
        // Quick event creation
        this.setupQuickEventCreation();
        
        // Bulk operations
        this.setupBulkOperations();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupQuickEventCreation() {
        // Double click to create event
        document.addEventListener('dblclick', (e) => {
            if (e.target.classList.contains('calendar-day')) {
                const dateStr = this.getDateFromElement(e.target);
                if (dateStr) {
                    this.quickCreateEvent(dateStr);
                }
            }
        });

        // Right-click context menu
        document.addEventListener('contextmenu', (e) => {
            if (e.target.classList.contains('calendar-day')) {
                e.preventDefault();
                this.showContextMenu(e, e.target);
            }
        });
    }

    quickCreateEvent(dateStr) {
        const modal = document.getElementById('eventModal');
        if (!modal) return;

        // Pre-fill the form
        document.getElementById('modalStartDate').value = dateStr;
        document.getElementById('modalEndDate').value = dateStr;
        
        // Auto-generate title based on category
        const categorySelect = document.getElementById('modalEventCategory');
        const titleInput = document.getElementById('modalEventTitle');
        
        categorySelect.addEventListener('change', function() {
            if (!titleInput.value) {
                const category = this.value;
                const titles = {
                    'personal': 'Personal Event',
                    'festival': 'Festival Celebration',
                    'national': 'National Holiday',
                    'religious': 'Religious Event',
                    'cultural': 'Cultural Activity'
                };
                titleInput.value = titles[category] || 'New Event';
            }
        });

        // Show modal
        modal.style.display = 'flex';
    }

    showContextMenu(e, target) {
        // Remove existing context menu
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${e.pageX}px;
            top: ${e.pageY}px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            min-width: 150px;
        `;

        const dateStr = this.getDateFromElement(target);
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString();

        menu.innerHTML = `
            <div class="context-menu-item" data-action="add-event">
                <i class="fas fa-plus"></i> Add Event
            </div>
            <div class="context-menu-item" data-action="view-events">
                <i class="fas fa-list"></i> View Events (${this.getEventsForDate(dateStr).length})
            </div>
            <div class="context-menu-item" data-action="set-reminder">
                <i class="fas fa-bell"></i> Set Reminder
            </div>
            <hr>
            <div class="context-menu-item" data-action="copy-date">
                <i class="fas fa-copy"></i> Copy Date
            </div>
        `;

        document.body.appendChild(menu);

        // Add event listeners
        menu.querySelector('[data-action="add-event"]').addEventListener('click', () => {
            this.quickCreateEvent(dateStr);
            menu.remove();
        });

        menu.querySelector('[data-action="view-events"]').addEventListener('click', () => {
            this.showDateEvents(dateStr);
            menu.remove();
        });

        menu.querySelector('[data-action="set-reminder"]').addEventListener('click', () => {
            this.setReminder(dateStr);
            menu.remove();
        });

        menu.querySelector('[data-action="copy-date"]').addEventListener('click', () => {
            navigator.clipboard.writeText(formattedDate);
            this.showNotification('Date copied to clipboard', 'success');
            menu.remove();
        });

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            });
        }, 100);
    }

    setupBulkOperations() {
        // Event selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('event')) {
                const eventId = e.target.dataset.eventId;
                if (eventId) {
                    this.toggleEventSelection(eventId, e.target);
                }
            }
        });

        // Bulk delete
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.selectedEvents.size > 0) {
                this.bulkDeleteEvents();
            }
        });
    }

    toggleEventSelection(eventId, element) {
        if (this.selectedEvents.has(eventId)) {
            this.selectedEvents.delete(eventId);
            element.classList.remove('selected');
        } else {
            this.selectedEvents.add(eventId);
            element.classList.add('selected');
        }
        
        this.updateBulkActions();
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulk-actions');
        if (!bulkActions) return;

        if (this.selectedEvents.size > 0) {
            bulkActions.style.display = 'flex';
            bulkActions.innerHTML = `
                <span>${this.selectedEvents.size} events selected</span>
                <button class="btn btn-danger" id="bulk-delete">
                    <i class="fas fa-trash"></i> Delete Selected
                </button>
                <button class="btn btn-secondary" id="bulk-cancel">
                    <i class="fas fa-times"></i> Cancel
                </button>
            `;

            bulkActions.querySelector('#bulk-delete').addEventListener('click', () => {
                this.bulkDeleteEvents();
            });

            bulkActions.querySelector('#bulk-cancel').addEventListener('click', () => {
                this.clearSelection();
            });
        } else {
            bulkActions.style.display = 'none';
        }
    }

    async bulkDeleteEvents() {
        if (this.selectedEvents.size === 0) return;

        const confirmed = confirm(`Are you sure you want to delete ${this.selectedEvents.size} events?`);
        if (!confirmed) return;

        const deletePromises = Array.from(this.selectedEvents).map(eventId => 
            this.deleteEvent(eventId)
        );

        try {
            await Promise.all(deletePromises);
            this.showNotification(`Successfully deleted ${this.selectedEvents.size} events`, 'success');
            this.clearSelection();
            
            // Refresh calendar
            if (window.smartCalendar) {
                window.smartCalendar.loadUserEvents();
            }
        } catch (error) {
            this.showNotification('Error deleting some events', 'error');
        }
    }

    clearSelection() {
        this.selectedEvents.clear();
        document.querySelectorAll('.event.selected').forEach(el => {
            el.classList.remove('selected');
        });
        this.updateBulkActions();
    }

    setupEventFiltering() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'calendar-filters';
        filterContainer.innerHTML = `
            <div class="filter-group">
                <h4>Categories</h4>
                <label><input type="checkbox" value="festival"> Festival</label>
                <label><input type="checkbox" value="national"> National</label>
                <label><input type="checkbox" value="religious"> Religious</label>
                <label><input type="checkbox" value="cultural"> Cultural</label>
                <label><input type="checkbox" value="personal"> Personal</label>
            </div>
            <div class="filter-group">
                <h4>Priority</h4>
                <label><input type="checkbox" value="high"> High</label>
                <label><input type="checkbox" value="medium"> Medium</label>
                <label><input type="checkbox" value="low"> Low</label>
            </div>
            <div class="filter-group">
                <h4>Date Range</h4>
                <input type="date" id="filter-start-date" placeholder="Start Date">
                <input type="date" id="filter-end-date" placeholder="End Date">
            </div>
            <button class="btn btn-primary" id="apply-filters">Apply Filters</button>
            <button class="btn btn-secondary" id="clear-filters">Clear Filters</button>
        `;

        // Add filters to calendar header
        const calendarHeader = document.querySelector('.calendar-header');
        if (calendarHeader) {
            calendarHeader.appendChild(filterContainer);
        }

        // Filter event listeners
        document.getElementById('apply-filters')?.addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('clear-filters')?.addEventListener('click', () => {
            this.clearFilters();
        });
    }

    applyFilters() {
        // Get selected categories
        const categoryCheckboxes = document.querySelectorAll('.filter-group input[value]:checked');
        this.filters.categories = new Set(Array.from(categoryCheckboxes).map(cb => cb.value));

        // Get selected priorities
        const priorityCheckboxes = document.querySelectorAll('.filter-group input[value]:checked');
        this.filters.priorities = new Set(Array.from(priorityCheckboxes).map(cb => cb.value));

        // Get date range
        const startDate = document.getElementById('filter-start-date').value;
        const endDate = document.getElementById('filter-end-date').value;
        this.filters.dateRange = startDate && endDate ? { start: startDate, end: endDate } : null;

        this.filterEvents();
    }

    filterEvents() {
        const events = document.querySelectorAll('.event');
        
        events.forEach(event => {
            const eventCategory = event.dataset.category;
            const eventPriority = event.dataset.priority;
            const eventDate = event.dataset.date;

            let shouldShow = true;

            // Category filter
            if (this.filters.categories.size > 0 && !this.filters.categories.has(eventCategory)) {
                shouldShow = false;
            }

            // Priority filter
            if (this.filters.priorities.size > 0 && !this.filters.priorities.has(eventPriority)) {
                shouldShow = false;
            }

            // Date range filter
            if (this.filters.dateRange && eventDate) {
                const eventDateObj = new Date(eventDate);
                const startDateObj = new Date(this.filters.dateRange.start);
                const endDateObj = new Date(this.filters.dateRange.end);

                if (eventDateObj < startDateObj || eventDateObj > endDateObj) {
                    shouldShow = false;
                }
            }

            event.style.display = shouldShow ? 'flex' : 'none';
        });
    }

    clearFilters() {
        this.filters.categories.clear();
        this.filters.priorities.clear();
        this.filters.dateRange = null;

        // Reset checkboxes
        document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        document.getElementById('filter-start-date').value = '';
        document.getElementById('filter-end-date').value = '';

        // Show all events
        document.querySelectorAll('.event').forEach(event => {
            event.style.display = 'flex';
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N: New event
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.quickCreateEvent(new Date().toISOString().split('T')[0]);
            }

            // Escape: Clear selection
            if (e.key === 'Escape') {
                this.clearSelection();
            }

            // Arrow keys: Navigate calendar
            if (e.key.startsWith('Arrow')) {
                this.handleArrowNavigation(e);
            }
        });
    }

    handleArrowNavigation(e) {
        e.preventDefault();
        
        switch(e.key) {
            case 'ArrowLeft':
                window.smartCalendar?.previousMonth();
                break;
            case 'ArrowRight':
                window.smartCalendar?.nextMonth();
                break;
            case 'ArrowUp':
                // Navigate to previous week
                break;
            case 'ArrowDown':
                // Navigate to next week
                break;
        }
    }

    setupDragAndDrop() {
        // This would require a more complex implementation
        // with proper drag and drop libraries
        console.log('Drag and drop setup would go here');
    }

    getDateFromElement(element) {
        // Extract date from calendar day element
        const dayElement = element.closest('.calendar-day');
        if (!dayElement) return null;

        const dayNumber = dayElement.querySelector('.day-number')?.textContent;
        if (!dayNumber) return null;

        const currentMonth = window.smartCalendar?.currentDate.getMonth() || new Date().getMonth();
        const currentYear = window.smartCalendar?.currentDate.getFullYear() || new Date().getFullYear();

        return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    }

    getEventsForDate(dateStr) {
        return window.smartCalendar?.getEventsForDate(dateStr) || [];
    }

    async deleteEvent(eventId) {
        // Implementation depends on your backend
        console.log('Delete event:', eventId);
    }

    showNotification(message, type) {
        // Use existing notification system
        if (window.smartCalendar) {
            window.smartCalendar.showNotification(message, type);
        }
    }

    showDateEvents(dateStr) {
        const events = this.getEventsForDate(dateStr);
        if (events.length === 0) {
            this.showNotification('No events for this date', 'info');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Events for ${new Date(dateStr).toLocaleDateString()}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="event-list">
                    ${events.map(event => `
                        <div class="event-item" data-event-id="${event.id}">
                            <div class="event-details">
                                <h4>${event.title}</h4>
                                <p>${event.category} • ${event.priority} priority</p>
                                ${event.description ? `<p>${event.description}</p>` : ''}
                            </div>
                            <div class="event-actions">
                                <button class="btn btn-sm btn-primary view-event">View</button>
                                ${event.user_id ? `<button class="btn btn-sm btn-danger delete-event">Delete</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // View event buttons
        modal.querySelectorAll('.view-event').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventItem = e.target.closest('.event-item');
                const eventId = eventItem.dataset.eventId;
                const event = events.find(e => e.id == eventId);
                if (event) {
                    modal.remove();
                    this.showEventDetails(event);
                }
            });
        });

        // Delete event buttons
        modal.querySelectorAll('.delete-event').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const eventItem = e.target.closest('.event-item');
                const eventId = eventItem.dataset.eventId;
                
                if (confirm('Are you sure you want to delete this event?')) {
                    await this.deleteEvent(eventId);
                    eventItem.remove();
                    
                    if (modal.querySelectorAll('.event-item').length === 0) {
                        modal.remove();
                    }
                }
            });
        });
    }

    showEventDetails(event) {
        // Use existing event details functionality
        if (window.smartCalendar) {
            window.smartCalendar.showEventDetails(event);
        }
    }

    setReminder(dateStr) {
        const reminderTime = prompt('Set reminder for (e.g., "15 minutes before", "1 day before"):');
        if (reminderTime) {
            // Save reminder to localStorage or send to backend
            const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
            reminders.push({
                date: dateStr,
                reminder: reminderTime,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('reminders', JSON.stringify(reminders));
            
            this.showNotification('Reminder set successfully', 'success');
        }
    }
}

// Initialize advanced calendar features
document.addEventListener('DOMContentLoaded', function() {
    window.advancedCalendar = new AdvancedCalendar();
    window.advancedCalendar.init();
});