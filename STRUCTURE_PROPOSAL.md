# Project Structure Proposal

## Current Structure Issues

### Root Directory

- ❌ `main.py` at root (should be in backend)
- ⚠️ `utils/` folder holds shared tools (secret_generator, deployers, bash scripts)
- ⚠️ Build/serve scripts at root level

### Frontend Structure (Pure HTML/CSS/JS)

- ❌ `Main_Pages/` has mixed concerns (HTML, CSS, JS all together)
- ❌ CSS files scattered: `all_pages.css`, `index.css`, `style.css` (duplicate/overlapping styles)
- ❌ Page-specific CSS mixed with global styles (Each-Place.css, Historical-Places.css, etc.)
- ❌ JS files at page root: `jquery.js`, `app.js`, `all_pages.js`
- ❌ Templates/components duplicated across pages
- ❌ Assets (fonts, images) not categorized

### Database

- ✅ `Database/` folder exists but could be cleaner
- ⚠️ SQL files need organization (migrations, schema structure)

## Proposed New Structure

```
iran-gard/
├── backend/                          # Backend Python/FastAPI
│   ├── main.py
│   ├── app/                         # ✓ Already well organized
│   │   ├── api/
│   │   ├── core/
│   │   ├── crud/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── utils/
│   ├── requirements.txt
│   └── .env*
│
├── frontend/                         # Pure HTML/CSS/JS frontend
│   ├── public/                       # Static HTML pages
│   │   ├── index.html               # Main landing page
│   │   ├── login-signup.html        # Auth page (move from root)
│   │   ├── home.html                # Dashboard/home (from Home-Page.html)
│   │   ├── places/
│   │   │   ├── historical.html      # Historical places
│   │   │   ├── natural.html         # Natural places
│   │   │   ├── religious.html       # Religious places
│   │   │   ├── entertainment.html   # Entertainment places
│   │   │   └── detail.html          # Place detail page (from Each-Place.html)
│   │   └── shared/
│   │       ├── header.html          # Reusable components
│   │       ├── footer.html
│   │       ├── navbar.html
│   │       └── place-card.html      # Reusable place card
│   │
│   ├── src/
│   │   ├── scripts/
│   │   │   ├── services/            # ✓ API integration
│   │   │   │   ├── auth-service.js
│   │   │   │   ├── places-service.js
│   │   │   │   └── api-client.js
│   │   │   │
│   │   │   ├── ui/                  # ✓ Page interactions
│   │   │   │   ├── login-signup.js
│   │   │   │   ├── home.js
│   │   │   │   ├── places.js
│   │   │   │   └── place-detail.js
│   │   │   │
│   │   │   ├── vendor/              # Third-party libraries
│   │   │   │   ├── jquery.js        # Moved from root
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── common/              # Shared functions
│   │   │   │   ├── helpers.js       # DOM helpers, utilities
│   │   │   │   ├── storage.js       # localStorage wrapper
│   │   │   │   └── validators.js    # Input validation
│   │   │   │
│   │   │   └── app.js               # Main entry point
│   │   │
│   │   ├── styles/
│   │   │   ├── base/
│   │   │   │   ├── reset.css        # Normalize/reset
│   │   │   │   ├── variables.css    # CSS custom properties
│   │   │   │   └── typography.css   # Fonts, text styles
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── header.css       # Header styles
│   │   │   │   ├── footer.css       # Footer styles
│   │   │   │   ├── navbar.css       # Navigation
│   │   │   │   └── grid.css         # Layout grid
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── buttons.css
│   │   │   │   ├── forms.css
│   │   │   │   ├── cards.css
│   │   │   │   ├── modals.css
│   │   │   │   ├── alerts.css
│   │   │   │   └── place-card.css
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── login-signup.css
│   │   │   │   ├── home.css
│   │   │   │   ├── places.css
│   │   │   │   ├── place-detail.css
│   │   │   │   ├── historical.css
│   │   │   │   ├── natural.css
│   │   │   │   ├── religious.css
│   │   │   │   └── entertainment.css
│   │   │   │
│   │   │   └── responsive/
│   │   │       ├── breakpoints.css  # Media queries
│   │   │       ├── mobile.css
│   │   │       └── tablet.css
│   │   │
│   │   └── assets/
│   │       ├── fonts/               # Custom fonts
│   │       ├── images/
│   │       │   ├── logo/
│   │       │   ├── places/
│   │       │   ├── icons/
│   │       │   └── backgrounds/
│   │       └── data/
│   │           └── places.json      # Place data (optional)
│   │
│   └── .serve-config                # Dev server config
│
├── utils/                            # Shared tools & scripts
│   ├── secret_generator.py          # Utility scripts
│   ├── deployers/                   # Deployment scripts
│   ├── scripts/
│   │   ├── serve-front.bat          # Windows server
│   │   └── serve-front.sh           # Linux/Mac server
│   └── README.md
│
├── database/                        # Database management
│   ├── schema/
│   │   ├── tables.sql               # Main schema
│   │   └── initial.sql              # DDL statements
│   ├── migrations/
│   │   ├── 001-create-tables.sql
│   │   └── 002-add-column.sql       # Future migrations
│   ├── maintenance/
│   │   └── drop-tables.sql          # Cleanup scripts
│   └── erd/
│       └── erd.drawio               # Entity diagram
│
├── .env.example                     # Environment template
├── README.md                        # Project documentation
└── COMMANDS.md                      # Build/run instructions
```

## Key Structure Decisions

### Frontend Organization (Pure HTML/CSS/JS)

✅ **Separation of Concerns**: Each layer clearly separated

- `public/` = HTML pages and static templates
- `src/styles/` = All CSS organized by function (base, layout, components, pages)
- `src/scripts/` = JavaScript organized by purpose (services, ui, vendor, common)
- `src/assets/` = Images, fonts, and data files

✅ **Scalability**: Easy to add new pages or features

- New page HTML in `public/pages/`
- New page CSS in `src/styles/pages/`
- New page JS in `src/scripts/ui/`

✅ **Maintainability**: No duplicate code

- Shared components in `public/shared/`
- Reusable styles in `src/styles/components/`
- Common functions in `src/scripts/common/`

### CSS Strategy

- **Base layer**: Reset, variables, typography
- **Layout layer**: Header, footer, grid system
- **Components layer**: Buttons, forms, cards (reusable)
- **Pages layer**: Page-specific overrides and customization
- **Responsive layer**: Media queries and mobile adjustments

### JavaScript Strategy

- **Services**: API communication (auth, places)
- **UI**: Page-specific interactions and event handlers
- **Common**: Shared utilities and helpers
- **Vendor**: Third-party libraries

### Backend & Utils

- **Backend**: Already well-structured, just move to `backend/` folder
- **Utils**: Holds shared tools (deployment scripts, utilities)
- **Database**: Clean separation of schema, migrations, maintenance

## Benefits of This Structure

✅ **Pure Frontend**: No build tools needed, just serve HTML/CSS/JS directly
✅ **Professional Organization**: Industry-standard structure for vanilla JS projects
✅ **Easy Navigation**: Clear folder purposes, logical file placement
✅ **Scalable**: Adding new pages requires minimal folder structure
✅ **Maintainable**: DRY principle - no code duplication
✅ **Responsive**: Separate responsive layer for easy media query management
✅ **Logical Load Order**: CSS loads in dependency order (base → layout → components → pages)

## Implementation Notes

- This structure works great for pure HTML/CSS/JS (no build step needed)
- All CSS should load in `index.html`: base → layout → components → pages → responsive
- JavaScript loads via `app.js` which imports necessary modules
- Easy to add build tools later (webpack, gulp, etc.) if needed

---

**Notes from User:**

- ⚠️ Keep existing functionality intact during migration
- ⚠️ Don't create new MD files - only move existing docs
- ⚠️ Focus on `app/` (already good), `Front/`, `database/`, `utils/` organization
