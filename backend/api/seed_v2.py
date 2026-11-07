"""Draft copy for the per-service pages and the first planning guide (childcare centres).

DRAFT: written from general knowledge of the Victorian planning system. The client should review it before it is relied on.
It is applied once per install (see SEED_VERSION in seed_content.py); after that it is edited in the admin.
"""

# slug -> overview (paragraphs separated by a blank line), process (Title | description), faqs (question, answer)
SERVICE_EXTRA = {
    'due-diligence': {
        'overview': (
            'Buying land, taking a lease or committing to a design is a significant decision, and the planning controls on a property can change what you are able to do with it. '
            'A town planning due diligence review looks at the planning scheme provisions that apply to the site before you sign a contract or commit to a concept.\n\n'
            'We read the zone, overlays, particular provisions and any restrictions on title together, and explain in plain language what they mean for your proposal: '
            'whether the use is permitted, which permits are likely to be needed and which issues could affect cost, timing or design. '
            'You finish with a clearer picture of the risks and a sensible next step.'),
        'process': [
            'Confirm the site and your idea | We confirm the address, title details and what you are considering, along with your timing.',
            'Review the planning controls | We check the zone, overlays, particular provisions and any covenants or easements that apply to the land.',
            'Identify permit triggers and risks | We work out which permits are likely to be needed and where approval risks or design constraints sit.',
            'Summarise options and next steps | You receive a clear summary of what appears possible, and recommended next steps.',
        ],
        'faqs': [
            ('When should I do a planning due diligence review?', 'Ideally before you sign a contract of sale or lease, or while a condition such as finance or due diligence is still open. A review at that stage lets you adjust your plans, negotiate or walk away before costs are committed.'),
            ('Does due diligence guarantee I will get a permit?', 'No. A review identifies the controls that apply and the likely approval pathway, but only council can decide a planning permit application. The aim is an informed decision, not a guaranteed outcome.'),
            ('What do I need to provide?', 'The property address or lot and plan number, a short description of what you want to do, and any sale contract or Section 32 statement you have. Photos or sketches are helpful but optional.'),
        ],
    },
    'multi-lot-subdivisions': {
        'overview': (
            'Dividing land into several lots involves the planning scheme, council requirements and design choices that all affect one another: lot sizes and shapes, access, servicing, drainage, vegetation and how each lot meets the street.\n\n'
            'Multi lot subdivision planning starts by testing how many lots a site can realistically support under the controls, then prepares the planning permit application and manages it through council. '
            'In Victoria a subdivision generally needs a planning permit first, followed by later steps such as certification, so it helps to plan the whole pathway early.'),
        'process': [
            'Test the feasibility | We review the controls and the land to see how it could be divided, and what that means for lot sizes, access and servicing.',
            'Develop the lot layout | We work with your surveyor or designer so the layout responds to the planning scheme from the start.',
            'Prepare and lodge the application | We prepare the town planning report and coordinate the documents for lodgement with council.',
            'Respond to council | We manage requests for further information, referrals and any public notice.',
            'Plan the steps after the permit | We explain permit conditions and the later steps, so you can plan the rest of the project.',
        ],
        'faqs': [
            ('How many lots can I get from my land?', 'It depends on the zone, overlays, the size and shape of the land, access and servicing. A feasibility review tests the options against the planning scheme before you spend on detailed plans.'),
            ('Do I need a planning permit to subdivide land?', 'In Victoria, subdividing land generally needs a planning permit, although the requirements depend on the zone, overlays and the type of subdivision. A due diligence review can confirm what applies to your property.'),
            ('What happens after the planning permit is issued?', 'The permit comes with conditions that must be satisfied, and the subdivision then goes through later steps such as certification of the plan. Your surveyor leads the technical steps, and we help you understand how they connect to the permit.'),
        ],
    },
    'use-and-development-permits': {
        'overview': (
            'A new use or development usually needs a planning permit before building or operating can begin. Council assesses the proposal against the planning scheme, looking at the zone, overlays, the neighbourhood context and matters such as traffic, parking, noise and amenity.\n\n'
            'We prepare the design documentation and town planning report for your application, lodge it, and manage it through council’s assessment, including requests for further information, public notice and referral comments. '
            'The aim is a complete, well-reasoned application that addresses the relevant provisions clearly.'),
        'process': [
            'Check whether a permit is needed | We review the zone and overlays to confirm whether your use or development needs a permit, and what council will look at.',
            'Coordinate the plans and reports | We work with your designer and any specialists so the plans and reports are based on the same information.',
            'Lodge the application | We prepare the town planning report and application documents, and lodge them with council.',
            'Respond to council and notice | We deal with requests for further information, referral comments and any objections.',
            'Review the permit conditions | We explain the conditions on the permit and what must happen before works or occupation.',
        ],
        'faqs': [
            ('How do I know if I need a planning permit?', 'It depends on the zone, any overlays and the use or works proposed. We check the planning scheme for your property and tell you whether a permit is likely to be needed, and why.'),
            ('What happens if council asks for more information?', 'Council may issue a request for further information before it can assess the application, usually with a deadline to respond. We read the request against the planning scheme and prepare one clear, complete response.'),
            ('Can neighbours object to my application?', 'Many applications are advertised, and neighbours and others can lodge objections that council must consider. Understanding the concerns early, and addressing them in the design or the application, can help.'),
        ],
    },
    'building-permit': {
        'overview': (
            'A building permit is the step that usually follows planning approval and comes before construction. It is issued by a registered building surveyor, who checks the documentation against the Building Code and Victorian building regulations.\n\n'
            'The design and documentation that supports a building permit needs to match the planning permit and its endorsed plans. '
            'We help develop the design for documentation, coordinate the drawings, and check them against the permit conditions, so the project moves from approval to construction without avoidable rework.'),
        'process': [
            'Review the planning permit | We start from the planning permit, its conditions and the endorsed plans.',
            'Develop the design for documentation | We help take the approved concept through to detailed design.',
            'Coordinate the documents | We coordinate the drawings and consultant inputs needed for the building permit application.',
            'Check against the conditions | We check that the documentation reflects the planning permit conditions.',
            'Support the application | We assist with the building permit application and with questions raised along the way.',
        ],
        'faqs': [
            ('Who can issue a building permit in Victoria?', 'In Victoria a building permit is issued by a registered building surveyor. Owners and builders can engage a private building surveyor or a council building surveyor, and the surveyor assesses the documentation against the building regulations.'),
            ('Do I need a planning permit before a building permit?', 'Where a planning permit is required, the building permit documentation needs to be consistent with it, and its conditions need to be addressed. That is why planning approval usually comes first.'),
            ('What if the design changes after planning approval?', 'Changes may mean the planning permit or its endorsed plans need to be amended. We can advise whether a change is likely to need an amendment before the building documentation is finalised.'),
        ],
    },
    'construction-management': {
        'overview': (
            'Approvals are only part of a development. During construction, decisions come up on site, permit conditions must be satisfied, and several consultants and contractors need to work from the same information.\n\n'
            'Our construction-stage consultation and management support keeps decisions, documentation and milestones connected from approval to completion. '
            'We do not supervise trades or administer building contracts (see the disclaimer on this page), but we can help you track permit conditions, coordinate information and keep the project aligned with what was approved.'),
        'process': [
            'Set the roadmap | We map the approvals, conditions and milestones between now and completion.',
            'Track conditions and milestones | We keep a record of what must be satisfied, by whom and by when.',
            'Coordinate the project team | We help keep consultants and contractors working from the same, current information.',
            'Advise as questions arise | We are available for planning and project questions as the project progresses.',
            'Support completion | We help you work through the final steps from approval to completion.',
        ],
        'faqs': [
            ('Do you supervise the builder or manage the building contract?', 'No. Permits Hub does not manage or supervise trades or administer independent building contracts. Our role is consultation and coordination of planning, documentation and milestones.'),
            ('What if the design needs to change during construction?', 'Some changes can affect the planning permit or its endorsed plans. We help you work out whether a change is likely to need an amendment, and what that would involve, before it is built.'),
            ('How is this different from a builder’s project manager?', 'Our focus is on approvals, permit conditions and documentation: keeping what is built consistent with what was approved. It sits alongside the builder’s own role rather than replacing it.'),
        ],
    },
}

LANDING = {
    'slug': 'childcare-centres',
    'title': 'Childcare centre planning permits in *Victoria*',
    'meta_title': 'Childcare Centre Planning Permits Victoria | Permits Hub',
    'meta_description': 'Planning permits for childcare centres in Victoria: site review, council requirements, reports and applications. Approvals at Winchelsea and St Leonards.',
    'intro': (
        'A childcare centre is a place families rely on, and council looks closely at how it will sit among its neighbours. '
        'In most zones a childcare centre needs a planning permit for the use and development, and the application needs to show how traffic, parking, noise and the surrounding neighbourhood have been considered.\n\n'
        'Permits Hub has worked on childcare centre approvals across Victoria, including a 100-place centre in Winchelsea, a 94-place centre in St Leonards and a planning report for an 81-place centre in Melton. '
        'This guide explains what councils usually look at and how the planning process works, so you know what to expect before you buy a site or finalise a design.'),
    'sections': [
        ('Do you need a planning permit for a childcare centre?',
         'In most zones a childcare centre needs a planning permit for the use and for the buildings and works. Whether a permit is needed, and what the planning scheme says about it, depends on the zone and any overlays on the property.\n\n'
         'A short planning review of the site before you commit to buying or leasing it will tell you whether a permit is needed and what council is likely to focus on.',
         []),
        ('What councils look at',
         'Every site is different, but applications for childcare centres commonly raise the same questions:',
         ['Traffic, drop-off and pick-up arrangements at peak times', 'Car parking for staff and families', 'Noise from outdoor play areas and mechanical plant',
          'Hours of operation', 'Landscaping and fencing to neighbouring properties', 'The location of the centre relative to other childcare centres and services']),
        ('Specialist reports that are often needed',
         'Depending on the site, an application may need input from specialists. Permits Hub helps identify which are likely to be needed, and in what order, so the reports are based on the same drawings.',
         ['Traffic and car parking assessment', 'Acoustic assessment of outdoor play areas and plant', 'Arborist report for trees on and near the site', 'Landscape concept and planting plan', 'Architectural plans and elevations']),
        ('How the process works',
         'A childcare centre application usually moves through these stages:',
         ['Site review: the zone, overlays, title restrictions and surrounding uses are reviewed before you commit.',
          'Design and reports: the architect and specialists prepare plans and reports, coordinated with the planning approach.',
          'Application: the town planning report and documents are lodged with council.',
          'Assessment: council may ask for further information, refer the application to authorities and advertise it to neighbours.',
          'Permit and conditions: if council approves, the permit comes with conditions to satisfy, including endorsed plans.',
          'Building permit and construction: documentation is prepared for a building surveyor, then construction can begin.']),
        ('Childcare work in the public record',
         'Permits Hub shared the approval of a 94-place childcare centre in St Leonards and planning and building permits for a 100-place centre in Winchelsea in June 2025. '
         'A town planning report for an 81-place centre at 31 Staughton Street, Melton, carries the Permits Hub name in the City of Melton’s published records. The project pages below link to the original public updates.',
         []),
        ('Getting started',
         'A property address or general location, the number of places you have in mind, your current stage and any plans or sketches are a useful starting point. You do not need drawings to begin.',
         []),
    ],
    'faqs': [
        ('Do I need a planning permit for a childcare centre in Victoria?', 'In most zones, yes: a childcare centre generally needs a planning permit for the use and development. The exact requirements depend on the zone and overlays, so check the specific property before you commit to it.'),
        ('What do councils look at for a childcare centre?', 'Councils commonly assess traffic and drop-off arrangements, car parking, noise from outdoor play areas, hours of operation, landscaping and fencing, and how the centre relates to its neighbours and to other childcare services nearby.'),
        ('What reports does a childcare centre application need?', 'It depends on the site, but traffic and parking, acoustic and arborist reports, a landscape plan and architectural drawings are common. A planning review early on identifies which are likely to be needed.'),
        ('How long does a childcare centre planning permit take?', 'There is no single answer. It depends on the council, the complexity of the site, whether council asks for further information and whether objections are received. A complete, well-prepared application generally helps.'),
        ('Can neighbours object to a childcare centre?', 'Many applications are advertised to neighbours, who can lodge objections that council must consider. Understanding likely concerns such as traffic and noise early, and responding to them in the design, can help the application.'),
        ('What happens after the planning permit is issued?', 'The permit includes conditions, and plans are usually endorsed before works. A building permit from a registered building surveyor is needed before construction, and its documentation needs to be consistent with the planning permit.'),
    ],
    'projects': ['st-leonards-childcare', 'winchelsea-childcare'],
}

# Service titles that were over 60 characters (old value -> new value, applied only if unedited).
TITLE_FIXES = {
    'building-permit': ('Building Permit Design & Documentation Melbourne | Permits Hub', 'Building Permit Design & Documentation | Permits Hub'),
}
