<?php

return [

    'projects' => [

        [
            'slug' => 'energy-forecasting-dss',
            'title' => 'Energy Consumption Forecasting with DSS',
            'tagline' => 'A decision support system that turns raw meter readings into a weekly energy forecast.',
            'year' => '2025',
            'role' => 'Developer · Data Analyst',
            'status' => 'live',
            'featured' => true,
            'accent' => '#C6FF3E',
            'cover' => '/images/projects/energy-forecasting-dss.svg',
            'stack' => ['Python', 'Pandas', 'scikit-learn', 'Flask', 'MySQL', 'Chart.js'],
            'links' => [
                'live' => null,
                'repo' => 'https://github.com/rbarcoma',
                'video' => null,
            ],
            'overview' => 'Hourly consumption data does not tell you what to do next — it just tells you what already happened. This project adds the missing layer: a forecasting pipeline with a decision support interface on top, so facility managers can see projected demand, compare scenarios, and act before a peak hits.',
            'features' => [
                'Ingested historical consumption data, cleaned and resampled into comparable windows',
                'Forecasting model trained on historical patterns with a documented evaluation baseline',
                'Decision support rules that turn a forecast into plain-language recommendations',
                'Interactive charts for actual vs. predicted demand with adjustable scenario inputs',
                'Exportable reports for reporting periods',
            ],
            'challenges' => [
                [
                    'problem' => 'Raw meter data was noisy, unevenly sampled, and full of missing windows.',
                    'solution' => 'Built a normalization pipeline that resamples on a fixed window, interpolates gaps, and flags outliers instead of silently dropping them.',
                ],
                [
                    'problem' => 'A raw prediction number is meaningless without a decision attached to it.',
                    'solution' => 'Separated forecasting from decision support: the model produces projections, a rules layer produces recommendations, and the UI shows both with their confidence.',
                ],
            ],
            'outcomes' => [
                'Forecast and recommendation pipeline running end to end',
                'Scenario comparisons replace guesswork in weekly planning',
            ],
            'gallery' => [],
        ],

        [
            'slug' => 'q8-booking-resort',
            'title' => 'Q8 Private Booking Resort',
            'tagline' => 'A full-stack reservation engine for a private resort — availability, bookings, and admin in one place.',
            'year' => '2025',
            'role' => 'Full-Stack Developer',
            'status' => 'private',
            'featured' => true,
            'accent' => '#22D3EE',
            'cover' => '/images/projects/q8-booking-resort.svg',
            'stack' => ['Laravel', 'MySQL', 'Blade', 'Tailwind CSS', 'JavaScript'],
            'links' => [
                'live' => null,
                'repo' => null,
                'video' => null,
            ],
            'overview' => 'Client work for a private resort: a booking engine that handles availability, guest details, and the admin side that keeps rooms and schedules straight. The hard part was never the form — it was making double bookings impossible under concurrent requests.',
            'features' => [
                'Availability search with date-range validation and per-unit capacity rules',
                'Booking flow with guest details, confirmation reference, and email notification',
                'Admin dashboard for units, bookings, and status changes',
                'Server-side validation and authorization on every mutating route',
                'Structured, indexed schema so availability queries stay fast as data grows',
            ],
            'challenges' => [
                [
                    'problem' => 'Two guests could book the same unit for the same dates at nearly the same moment.',
                    'solution' => 'Wrapped booking creation in a transaction with row-level locking on the unit record, then re-validated availability inside the transaction before committing.',
                ],
                [
                    'problem' => 'Admin screens were becoming a second, inconsistent UI language.',
                    'solution' => 'Reused one layout, one form component style, and one validation error contract across guest and admin surfaces.',
                ],
            ],
            'outcomes' => [
                'Booking engine accepted live reservations, replacing a manual spreadsheet process',
                'Admin can manage units and bookings without engineering help',
            ],
            'gallery' => [],
        ],

        [
            'slug' => 'assembly-simulator',
            'title' => 'Assembly and Disassembly Simulator',
            'tagline' => 'An interactive simulator that steps through assembly and disassembly sequences step by step.',
            'year' => '2024',
            'role' => 'Developer · UI Engineer',
            'status' => 'wip',
            'featured' => true,
            'accent' => '#A78BFA',
            'cover' => '/images/projects/assembly-simulator.svg',
            'stack' => ['JavaScript', 'Three.js', 'Laravel', 'Bootstrap'],
            'links' => [
                'live' => null,
                'repo' => null,
                'video' => null,
            ],
            'overview' => 'A teaching and training tool: load a machine assembly, then step forward and backward through its assembly and disassembly order with the current step explained, the relevant parts highlighted, and the tooling called out.',
            'features' => [
                'Step-by-step assembly and disassembly sequences with previous/next navigation',
                '3D viewport with the active part highlighted and the rest dimmed',
                'Per-step instructions, tooling notes, and torque/sequence warnings',
                'Progress tracking so a learner can resume where they stopped',
                'Designed for classroom use on ordinary laptops',
            ],
            'challenges' => [
                [
                    'problem' => '3D on classroom hardware meant low frame rates and unusable teaching demos.',
                    'solution' => 'Kept the scene lean, decoupled the simulation state from rendering, and made the step UI fully usable without the 3D viewport.',
                ],
                [
                    'problem' => 'Sequences needed to be editable by non-programmers.',
                    'solution' => 'Stored sequences as structured data with a clear schema, so content updates never required a code change.',
                ],
            ],
            'outcomes' => [
                'Working simulator covering full assembly and disassembly of a multi-part assembly',
                'Sequence content can be updated without touching application logic',
            ],
            'gallery' => [],
        ],

    ],

    'statuses' => [
        'live' => ['label' => 'Live', 'class' => 'text-accent border-accent/40 bg-accent/10'],
        'wip' => ['label' => 'Work in progress', 'class' => 'text-amber-300 border-amber-300/40 bg-amber-300/10'],
        'private' => ['label' => 'Private project', 'class' => 'text-muted-foreground border-white/15 bg-white/5'],
    ],

];
