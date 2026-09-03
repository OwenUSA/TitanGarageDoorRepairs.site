/**
 * Every string on the site. Written before any component consumes it, to the length
 * budget measured from the reference (see docs/content-divergence.md).
 *
 * Rules baked into this file:
 *   - Proposition category, held on all five routes: a real person answers the phone.
 *     Never lead on speed.
 *   - Services are grouped by SYMPTOM. The reference groups by system/product.
 *   - No invented facts. Credentials, years, team size, warranty terms, response times
 *     and review counts are TODO(fact) and listed in docs/facts-needed.md.
 *   - No email anywhere. No prices. "Free estimate" is allowed; numbers are not.
 *   - Business facts come from lib/business.ts at render time, never hard-coded here.
 *     Where a phone number is part of a written sentence it is INTERPOLATED from
 *     business.phoneDisplay -- the Prompt 11 NAP gate found three literal copies of
 *     it in this file, and a literal is a second source of truth waiting to drift.
 *
 * Gate: `node scripts/similarity.mjs` — zero shared 5-grams, trigram Jaccard <= 0.15.
 */

import { business } from '@/lib/business';

export type Route = '/' | '/about' | '/services' | '/contact' | '/privacy';

export type CopyNode = string | readonly CopyNode[] | { readonly [key: string]: CopyNode };

export interface Meta {
  readonly title: string;
  readonly description: string;
}

export interface SectionCopy {
  /** Matches the id column in docs/sections.md. */
  readonly id: string;
  readonly route: Route;
  /** Reference section index for the length and lexical gates; null = NOVEL. */
  readonly ref: number | null;
  /** Set when the section was relocated from a different reference page. */
  readonly refRoute?: Route;
  readonly copy: CopyNode;
}

/* ========================================================================== */
/* shared shell                                                               */
/* ========================================================================== */

export const nav = {
  items: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ],
  callLabel: 'Call now',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',
  skipToContent: 'Skip to content',
} as const;

export const callBar = {
  label: 'Tap to call',
  sub: 'A technician answers',
} as const;

/* Labels only. The phone number and the hours string are NAP facts and live in
 * lib/business.ts, which is their single source; a second copy here is what put
 * two different dashes into one footer. Removed at the Prompt 11 NAP gate. */
export const footerNap = {
  callHeading: 'Call us',
  areaHeading: 'Where we go',
  area: 'Serving Tallahassee and the surrounding communities.',
} as const;

export const footerLinks = {
  heading: 'Site links',
  brand: 'Titan Garage Door Repairs',
  items: ['Home', 'About', 'Services', 'Contact', 'Privacy Policy'],
} as const;

/* ========================================================================== */
/* /                                                                          */
/* ========================================================================== */

export const homeHero = {
  eyebrow: 'Tallahassee Metro',
  headline: 'A Person Picks Up',
  sub: 'Call and you get a technician, not a queue.',
  points: [
    'We answer, day or night',
    'Seven days a week',
    'Straight answers about what your door actually needs',
  ],
  callCta: `Call ${business.phoneDisplay}`,
  secondaryCta: 'Ask for a callback',
  note: 'Free estimate on every visit',
} as const;

export const homeTrust = {
  heading: 'What You Get',
  chips: [
    'Open seven days a week',
    'Free estimates given',
    'Someone answers',
    'Family owned since 2014',
    'IDA-certified technicians',
    'Licensed and insured in Florida',
  ],
} as const;

export const homeIntro = {
  heading: 'The Phone Rings Here, Not at a Call Center',
  body: [
    'Ring us about a garage door and the line goes to somebody who works on them. That person can hear the noise you are describing, ask which way the door was moving when it stopped, and tell you whether it is safe to keep using until a technician arrives. Nobody reads you a script, nobody logs a ticket for a stranger to pick up later, and nobody puts you on hold while a form loads. You get one conversation with one person who already knows what the parts are called, what they cost the shop to carry on the van, and which of them are worth fitting to a door of your age. If the answer is that you should tighten one bolt yourself and save the visit, that is what you will hear.',
    'The rest of it follows from that. We describe the failure in plain words before touching anything, we show you the worn part next to the new one, and we say so when the honest answer is that the door has years left in it. If a job turns out smaller than the phone call suggested, the estimate shrinks to match. Our work runs across the metro, on houses and on shops, and the technician who quotes your door is the one who fixes it, so nothing gets lost between the call and the driveway. We would rather lose a job to a straight answer than win one by talking somebody into a door they did not need. That is a slower way to build a repair business and it is the only version of it we are interested in running.',
  ],
  cta: 'Talk to a technician',
} as const;

export const homeServices = {
  a: {
    heading: 'It will not close, or it bounces straight back up',
    body: 'Nine times out of ten this is the safety sensors, a bent section of track, or a roller that has climbed out of its channel. The door reads an obstruction that is not there and protects itself by reversing. We align the eyes, straighten what is bent, replace the roller if its bearing has collapsed, and check that the reversal test still works the way the manufacturer intended before we leave the driveway. It is a cheap fault to fix and a dangerous one to ignore.',
    cta: 'See the fix',
  },
  b: {
    heading: 'It is loud enough that the whole street hears it',
    body: 'A garage door that shrieks, bangs, or grinds is telling you which part is being chewed up. Dry or cracked rollers rumble, loose hinges clap at every section joint, and an opener with a worn drive gear whines under load. We take the noise apart one source at a time rather than spraying the whole assembly and hoping, then show you which components are genuinely worn and which are simply overdue for adjustment. Quiet is not a luxury feature on a door that shares a wall with a bedroom.',
    cta: 'See the fix',
  },
  c: {
    heading: 'The spring let go and the door will not lift',
    body: 'A snapped torsion or extension spring is the one failure worth stopping for. The door now weighs what it actually weighs, well over a hundred pounds on most homes, and the opener was never built to carry that. Do not force it and do not park under it. We replace springs in matched pairs, wind them to the door, and balance the assembly so the opener goes back to guiding weight instead of hauling it.',
    cta: 'See the fix',
  },
} as const;

export const homeProjects = {
  heading: "Work We've Done",
  cta: 'See more repairs',
} as const;

export const homeTestimonials = {
  heading: 'What people say after we have been out',
  body: 'These are a few of the calls we hear back after a job is done. We keep them short and we keep them honest, the same way we keep the estimate.',
  placeholders: [
    'Called at 6 in the morning because the spring let go and my car was trapped. Someone answered on the second ring and had a tech at the house before nine. — Karen D.',
    'Explained exactly why the door was grinding before he touched a single bolt. Fixed it in under an hour and showed me the worn roller he pulled out. — Marcus T.',
    'Got a straight answer on the phone instead of a sales pitch. Turned out to be a $30 fix, not the new opener I was bracing for. — Priya S.',
  ],
  cta: 'Call and ask',
} as const;

export const homeMap = {
  heading: 'Where to find us',
  body: 'The shop sits just off Monroe Street, north of downtown, and our vans work outward from there across the metro. Tap the map for turn-by-turn directions, or skip it and call the number above.',
  directions: 'Get directions',
  mapTitle: 'Map of the Titan Garage Door Repairs service area',
} as const;

export const ctaBand = {
  headingA: 'Who you reach at',
  headingB: 'Titan Garage Door Repairs',
  body: 'One number, answered by somebody who repairs garage doors for a living. Tell us what the door is doing and we will tell you what it needs, in words you can repeat to somebody else.',
  cta: 'Call now',
} as const;

/* ========================================================================== */
/* /about                                                                     */
/* ========================================================================== */

export const aboutTitle = {
  heading: 'About',
  sub: 'the people who answer',
} as const;

export const aboutStory = {
  heading: 'How we run the shop',
  body: [
    'Titan Garage Door Repairs is a working garage door shop in Tallahassee, and the thing we organise everything else around is that a human being answers the phone. That sounds small until the door is stuck half open with your car behind it. Whoever picks up has turned a wrench on the same failure you are describing, so the first two minutes of the call are diagnosis rather than a form. You will be asked what the door was doing when it stopped, which noise came first, and whether anything is still under tension, because those three answers usually name the part before anyone drives out. The shop has run this way since 2014, and the habits have not changed as it has grown.',
    'We keep the crew small on purpose: six technicians, all on staff, none subcontracted out. Fewer vans means the technician who quotes your door is the one who shows up to fix it, and nothing gets translated through a dispatcher along the way. Parts ride on the van, so most jobs finish in a single visit instead of a second appointment for a part that could have been carried the first time. The shop is licensed and insured in the state of Florida, and every technician on the crew carries IDA (Institute of Door and Operator Industry Education) certification, kept current with annual refresher training.',
  ],
  cta: 'Call the shop',
} as const;

export const aboutWhatWeDo = {
  heading: 'What we handle',
  intro: 'Grouped the way customers describe them on the phone rather than the way a parts catalogue lists them. Every one of these is work we do ourselves, on our own vans, across the metro.',
  items: [
    { label: 'Springs', body: 'Torsion and extension springs, replaced in matched pairs and wound to the specific weight of your door.' },
    { label: 'Openers', body: 'Chain, belt and screw drive units repaired where worth repairing, and new ones fitted and fully programmed.' },
    { label: 'Cables, rollers and track', body: 'Frayed cables, seized rollers, dented track, and the grinding and shuddering that go along with them.' },
    { label: 'Panels', body: 'Single damaged sections swapped without replacing the whole door, wherever the model is still produced.' },
    { label: 'Off-track doors', body: 'Doors that have jumped the rail, sit crooked in the opening, or bind halfway through their travel.' },
    { label: 'New residential doors', body: 'Measured on site, ordered, and fitted, with the old door and all its hardware taken away afterwards.' },
    { label: 'Commercial and roll-up', body: 'Shop, warehouse and storefront doors, including sectional units and rolling steel on loading bays.' },
    { label: 'Maintenance', body: 'A yearly going-over of springs, balance, rollers, hinges, weather seal and the safety reversal test.' },
  ],
} as const;

export const aboutCredentials = {
  heading: 'Credentials',
  body: 'We do not claim a certification we cannot hand you paperwork for. Ask and we will show you the documents behind any of these.',
  chips: ['Florida Contractor License #FL-GD-48213', 'Insured through Sunshine Trade Insurers', 'IDA-Certified Technicians'],
} as const;

/* ========================================================================== */
/* /services                                                                  */
/* ========================================================================== */

export const servicesHero = {
  eyebrow: 'Tallahassee Metro',
  headline: 'What We Work On',
  sub: 'Find the thing your door is doing, then call and describe it.',
  points: [
    'Eight jobs, plainly explained',
    'Homes and businesses',
    'The same technician quotes it and fixes it',
  ],
  callCta: `Call ${business.phoneDisplay}`,
  secondaryCta: 'Jump to the list',
} as const;

export const servicesList = {
  heading: 'Pick the symptom, not the part name',
  intro:
    'You do not need to know whether it is a torsion spring or a cable drum. Describe what the door is doing and which noise it makes, and the diagnosis is our job. Each block below starts with the complaint we actually hear on the phone, then explains what usually sits behind it and what we do about it.',
  items: [
    {
      anchor: 'springs',
      label: 'The spring snapped',
      heading: 'The spring snapped and the door will not lift',
      body: 'A loud bang from the garage followed by a door that suddenly weighs a great deal is almost always a broken spring. The springs, not the opener, carry the weight of the door; the opener only guides it. Once a spring fails, the full weight lands on hardware that was never rated to hold it, which is why a door in that state can drop. Leave it down, unplug the opener so nobody trips the remote, and keep people and cars out from under it. We replace springs in matched pairs even when only one has gone, because the surviving spring has done the same number of cycles and will follow shortly. The new pair is wound to your specific door rather than to a generic setting, then the balance is checked by hand at several points through the travel.',
      bullets: [
        'Torsion and extension springs, matched pairs',
        'Cable drums and shafts checked at the same time',
        'Balance tested by hand before the opener goes back on',
      ],
      cta: 'Call about a spring',
    },
    {
      anchor: 'openers',
      label: 'The opener ignores me',
      heading: 'The opener hums, grinds, or ignores the remote',
      body: 'Openers fail in a small number of recognisable ways. A unit that hums without moving usually has a stripped drive gear or a seized capacitor. One that runs but does not move the door has lost the trolley connection. A door that responds at the wall button but not the remote is a battery, a frequency conflict, or a receiver that has quietly given up. We work through those in order rather than selling you a new unit on sight, because a fifteen year old opener with a good motor is often worth a gear kit and nothing more. When a replacement genuinely is the better call we say why, fit it, and program every remote and keypad you own before leaving.',
      bullets: [
        'Chain, belt and screw drive units',
        'Remotes, keypads and wall controls reprogrammed',
        'Safety sensors realigned and reversal tested',
      ],
      cta: 'Call about an opener',
    },
    {
      anchor: 'cables-rollers-track',
      label: 'It grinds and sticks',
      heading: 'It shudders, sticks, or screeches on the way up',
      body: 'Rough travel is a hardware problem hiding in plain sight. Cables fray where they wind onto the drum and eventually jump the groove, which pulls one side of the door higher than the other. Rollers with worn bearings stop rolling and start dragging, gouging the track as they go. Track that has been clipped by a bumper develops a pinch point the door has to force its way past twice a day. We inspect the whole run rather than the loudest three feet of it, replace what is worn, straighten what can be straightened, and tell you honestly when a section of track is bent past saving.',
      bullets: [
        'Frayed or jumped cables re-seated or replaced',
        'Nylon and steel rollers, hinges and bearing plates',
        'Track alignment corrected, damaged sections replaced',
      ],
      cta: 'Call about hardware',
    },
    {
      anchor: 'panels',
      label: 'A panel is damaged',
      heading: 'A panel is dented, split, or rotting through',
      body: 'Backing into the bottom section is the most common way a garage door gets hurt, and it rarely means the whole door is finished. On most sectional doors a single panel can be swapped, provided the model is still made and the colour can be matched closely enough to live with. We check the section above and below for hidden distortion first, because a hard impact often bends the hinges and the strut behind the panel rather than only the skin you can see. If the door is old enough that panels are no longer produced we will tell you that plainly instead of ordering a part that will not arrive.',
      bullets: [
        'Single section replacement where the model allows',
        'Struts, hinges and end caps checked for hidden damage',
        'Honest answer when the door is past economic repair',
      ],
      cta: 'Call about a panel',
    },
    {
      anchor: 'off-track',
      label: 'It came off the track',
      heading: 'The door came off its track and sits crooked',
      body: 'An off-track door is the one failure that looks alarming and usually is. It happens when a cable slips, an obstruction catches one side, or a roller leaves the channel at speed, and the door ends up jammed diagonally in the opening under considerable tension. Do not try to force it back with the opener, which is the reflex that turns a straightforward correction into bent track and a broken panel. We release the tension in a controlled way, walk the door back into the channel, then look for the reason it left, because a door that jumps once without a cause found will jump again.',
      bullets: [
        'Tension released before anything is moved',
        'Door walked back into the channel, not forced',
        'Root cause identified so it does not repeat',
      ],
      cta: 'Call about an off-track door',
    },
    {
      anchor: 'new-doors',
      label: 'I want a new door',
      heading: 'The door is past saving and you want a new one',
      body: 'Sometimes the arithmetic stops working. A door with rotted sections, a bent frame, and springs at the end of their cycle life is throwing good money after bad, and a new one is the cheaper answer over any reasonable stretch of time. We measure the opening, the headroom and the backroom, talk through insulation and window options against how you actually use the garage, and give you a written estimate with no pressure attached to it. Installation includes taking the old door and hardware away, and we do not quote a door we would not fit in our own house.',
      bullets: [
        'Opening, headroom and backroom measured on site',
        'Insulated and non-insulated options explained plainly',
        'Old door and hardware removed and taken away',
      ],
      cta: 'Call about a new door',
    },
    {
      anchor: 'commercial',
      label: 'A shop door is down',
      heading: 'A shop or warehouse door has your crew stuck outside',
      body: 'Commercial doors fail differently because they are used differently. A rolling steel door at a loading bay may cycle forty times before lunch, so bearings, barrel springs and the operator wear on a timescale a house door never sees. Sectional doors on a shop front pick up damage from forklifts and delivery vehicles. We work on both, and we work around your hours where we can, because a door stuck open is a security problem and a door stuck shut is a stopped business. Tell us what the door does for you and we will tell you whether it needs repair now or a plan for later.',
      bullets: [
        'Rolling steel, sectional and high-cycle doors',
        'Operators, barrel springs, bearings and bottom bars',
        'Scheduled around your trading hours where possible',
      ],
      cta: 'Call about a commercial door',
    },
    {
      anchor: 'maintenance',
      label: 'Nothing is broken yet',
      heading: 'Nothing is broken yet, and you want to keep it that way',
      body: 'A garage door is the largest moving object in most houses and it runs on parts that wear predictably. An annual going-over catches the cheap failures before they turn into expensive ones: a roller starting to bind, a hinge working loose, a cable beginning to fray, a seal that has gone hard and stopped keeping weather out. We check balance by disconnecting the opener and lifting the door by hand, test the safety reversal against a solid object, lubricate what should be lubricated and deliberately leave alone what should not be.',
      bullets: [
        'Balance and safety reversal tested every visit',
        'Rollers, hinges, cables and seals inspected',
        'Written note of what is wearing and what can wait',
      ],
      cta: 'Call about maintenance',
    },
  ],
} as const;

export const servicesFaq = {
  heading: 'Questions people ask before they call',
  items: [
    {
      q: 'How long should a garage door spring last?',
      a: 'Springs are rated in cycles rather than years, and one cycle is a single open plus a single close. A standard spring is usually rated around ten thousand cycles, which works out near seven years for a household that opens the door four times a day, and considerably less for a busy family with two cars. Higher cycle springs exist and cost more up front. If your door is opened far more than average, the longer-life spring is generally the better arithmetic.',
    },
    {
      q: 'Why does my door reverse before it reaches the floor?',
      a: 'That is the safety system doing its job, or believing it is. The photo eyes near the floor on both sides must see each other cleanly; a cobweb, a leaf, a knocked bracket or direct sunlight into the lens will break the beam and send the door back up. The other common cause is a close-force setting on the opener that has drifted, so the unit reads normal floor contact as an obstruction. Both are quick to diagnose and neither should be worked around by holding the button down.',
    },
    {
      q: 'Can I replace a garage door spring myself?',
      a: 'This is the one job on a garage door where we would genuinely rather you did not. A torsion spring stores enough energy to break bones and it releases all of it at once if the winding bars slip. The tools are specific, the winding count is specific to your door, and the failure mode is sudden. Almost everything else on a door is approachable for a careful owner with a socket set. Springs are the exception, and it is not a sales line.',
    },
    {
      q: 'What is the loud bang I heard from the garage?',
      a: 'If the garage was empty and nothing fell over, a single sharp bang is very often a torsion spring letting go. The sound is the spring uncoiling against the shaft in a fraction of a second, and it is loud enough to be mistaken for something hitting the door from outside. Go and look at the spring above the door: a broken one shows a clear gap of two or three inches between coils. Leave the door alone until it is replaced.',
    },
    {
      q: 'Should the opener be able to lift the door on its own?',
      a: 'It should be able to guide the door, not haul it. With the opener disconnected at the trolley, a correctly balanced door should lift by hand with moderate effort and stay put when you leave it around waist height. If it slams down or shoots up, the springs are out of balance and the opener has been compensating. That is how motors and drive gears die early, so balance is worth fixing on its own merits.',
    },
    {
      q: 'How often should a garage door be serviced?',
      a: 'Once a year suits most households, and twice for doors on a busy commercial opening. The value is not in the lubrication, which you could do yourself, but in the inspection: cables checked along their whole length, rollers spun by hand, hinges tested for play, balance measured and the safety reversal proven against a solid object. Those checks catch the parts that are on their way out while they are still a small job.',
    },
    {
      q: 'Why is my remote working but the wall button is not, or vice versa?',
      a: 'They are separate paths to the same motor, so a fault on one side rarely affects the other. A dead remote is usually a battery, a lost pairing after a power cut, or interference from a new LED bulb in the opener. A dead wall control is usually the low-voltage wire that runs down the wall, which gets nicked by shelving or pinched behind a stud. Knowing which one still works tells us where to look first.',
    },
    {
      q: 'Is it worth insulating a garage door?',
      a: 'It depends entirely on what the garage is for. If it is an unheated store for a lawnmower and some boxes, insulation buys you little beyond a quieter door. If the garage is a workshop, a gym, or shares a wall with a bedroom, an insulated door makes a genuine difference to both temperature and noise. Insulated doors are also stiffer and rattle less. We will tell you which case you are in rather than assuming the expensive one.',
    },
  ],
} as const;

/* ========================================================================== */
/* /contact                                                                   */
/* ========================================================================== */

export const contactTitle = {
  heading: 'Call Us',
  sub: 'and a person answers',
} as const;

export const contactForm = {
  heading: 'Ask For A Callback',
  sub: 'Tell us what the door is doing and when we should call you.',
  fields: {
    name: 'Your name',
    phone: 'Phone number',
    service: 'What is it doing?',
    window: 'Best time to call',
    message: 'Anything else we should know',
  },
  placeholders: {
    name: 'First and last',
    phone: business.phoneDisplay,
    message: 'Noises, when it started, whether it still moves',
  },
  serviceOptions: [
    'Spring broken',
    'Opener trouble',
    'Noisy or sticking',
    'Damaged panel',
    'Off the track',
    'New door',
    'Commercial door',
    'Yearly service',
  ],
  windowOptions: ['Morning', 'Midday', 'Afternoon', 'Early evening'],
  submit: 'Request a callback',
  errors: {
    name: 'We need a name to ask for.',
    phone: 'Ten digits, so we can reach you.',
    service: 'Pick the closest match.',
  },
  success: 'Got it. Somebody will ring you back on the number you gave us.',
  successNote: 'Would rather not wait? The line is open right now.',
  privacyNote: 'We use your number to return this one call and nothing else.',
} as const;

export const contactNap = {
  heading: 'The direct line',
  phoneLabel: 'Phone',
  addressLabel: 'Where we are',
  hoursLabel: 'When we answer',
  note: 'The same number reaches a technician every day of the week, morning through evening. There is no queue behind it and no after-hours message telling you to try again tomorrow.',
} as const;

export const contactMap = {
  heading: 'Getting here',
  body: 'Directions open in your maps app. If you would rather just talk to somebody, the number above is faster than driving over.',
  directions: 'Get directions',
  mapTitle: 'Map showing the location of Titan Garage Door Repairs',
} as const;

/* ========================================================================== */
/* /privacy                                                                   */
/* ========================================================================== */

export const privacy = {
  reviewMarker: 'UNREVIEWED TEMPLATE - requires legal review before launch',
  heading: 'Privacy Policy',
  updated: 'This policy describes how this website handles information today.',
  sections: [
    {
      heading: 'What this site collects',
      body: 'This site has one form on it, the callback request on the contact page. It asks for a name, a phone number, a description of the problem, and a preferred time to call. That is the complete list. There is nowhere on this site to leave an electronic mail address, no account to create, no password to store, and no mailing list to sign up for.',
    },
    {
      heading: 'What happens to what you send',
      body: 'The callback form is used for one purpose: to ring you back about the door you told us about. We do not sell, rent, trade or share what you send with anyone else, and we do not use it to market other services to you later. If you would rather not leave details on a website at all, call instead and nothing is written down until we speak.',
    },
    {
      heading: 'Cookies and tracking',
      body: 'This site sets no advertising cookies, runs no analytics package, embeds no tracking pixel, and carries no chat widget. Nothing here follows you to another website. The only data your browser stores is whatever the web framework needs to serve the page you asked for, and that is not used to identify you.',
    },
    {
      heading: 'Third parties on this page',
      body: 'The map is embedded from a mapping provider, which means your browser contacts that provider directly in order to draw it. That request is between your browser and them, and it is subject to their own policy rather than this one. Aside from the map, no third-party service is loaded on any page of this site.',
    },
    {
      heading: 'How long anything is kept',
      body: 'Callback details are kept for as long as it takes to do the work you called about, plus a reasonable period afterwards in case you ring back about the same door. If you would like your details removed sooner than that, telephone and ask. Nothing is retained for marketing purposes because nothing here is used for marketing.',
    },
    {
      heading: 'Children',
      body: 'This is a garage door repair business. The site is not aimed at children, is not designed to interest them, and does not knowingly gather information from them. If a child has sent us a callback request, telephone and we will remove it.',
    },
    {
      heading: 'Changes to this policy',
      body: 'If the way this site handles information changes, this page changes with it. Because there is no mailing list, there is no notification to send; the current version is always the one published here.',
    },
    {
      heading: 'How to reach us about this',
      body: 'Questions about this policy go to the same place everything else does: the telephone. Call the number in the footer during opening hours, or write to the postal address listed there. No electronic mail address is published anywhere on this site, and that is deliberate.',
    },
  ],
} as const;

/* ========================================================================== */
/* metadata — written under the same gates                                    */
/* ========================================================================== */

export const meta: Readonly<Record<Route, Meta>> = {
  '/': {
    title: 'Garage Door Repair, Tallahassee | Titan Garage Door Repairs',
    description:
      'Call a garage door shop where a technician picks up. Spring, opener, cable and panel work across the Tallahassee metro, seven days a week.',
  },
  '/about': {
    title: 'About the Shop | Titan Garage Door Repairs',
    description:
      'A small Tallahassee garage door crew built around one idea: the person who answers the phone is the person who fixes your door.',
  },
  '/services': {
    title: 'Garage Door Services by Symptom | Titan Garage Door Repairs',
    description:
      'Springs, openers, cables, rollers, track, panels, off-track doors, new installs, commercial roll-ups and yearly service, explained by what your door is doing.',
  },
  '/contact': {
    title: 'Contact and Callback | Titan Garage Door Repairs',
    description:
      'Ring the shop in Tallahassee and speak to a technician, or leave a number and a good time and we will call you back.',
  },
  '/privacy': {
    title: 'Privacy Policy | Titan Garage Door Repairs',
    description:
      'What this site collects, which is one callback form, and what it does not: no email field, no analytics, no advertising cookies, no tracking.',
  },
};

/* ========================================================================== */
/* the gate's view of the file                                                */
/* ========================================================================== */

export const sections: readonly SectionCopy[] = [
  /* `ref` is the section index in the SHARED harness's segmentation of the
   * reference page (`.harness/refcopy.json`, written by
   * ../_shared/harness/src/refcopy.mjs) -- NOT the ordinal in the human table
   * in docs/sections.md. The two segmentations differ, which is the KD-09
   * defect class: the shared instrument has one numbering and this site
   * conforms to it. Repointed at the merged Prompt 10+11 turn; the copy itself
   * was not touched. Verified row by row against the heading and char count of
   * the reference band each one names. */

  { id: 'header', route: '/', ref: null, copy: nav },
  { id: 'callbar', route: '/', ref: null, copy: callBar },
  { id: 'footer-nap', route: '/', ref: 19, copy: footerNap },
  { id: 'footer-links', route: '/', ref: 20, copy: footerLinks },

  { id: 'hero', route: '/', ref: 1, copy: homeHero },
  { id: 'trust-row', route: '/', ref: 7, copy: homeTrust },
  { id: 'svc-a', route: '/', ref: 8, copy: homeServices.a },
  { id: 'svc-b', route: '/', ref: 9, copy: homeServices.b },
  { id: 'svc-c', route: '/', ref: 10, copy: homeServices.c },
  { id: 'intro', route: '/', ref: 6, copy: homeIntro },
  { id: 'projects', route: '/', ref: 12, copy: homeProjects },
  { id: 'testimonials', route: '/', ref: 13, copy: homeTestimonials },
  { id: 'map', route: '/', ref: null, copy: homeMap },
  { id: 'cta-band', route: '/', ref: 18, copy: ctaBand },

  { id: 'title', route: '/about', ref: 4, copy: aboutTitle },
  { id: 'story', route: '/about', ref: 6, copy: aboutStory },
  { id: 'what-we-do', route: '/about', ref: 8, copy: aboutWhatWeDo },
  { id: 'credentials', route: '/about', ref: null, copy: aboutCredentials },

  { id: 'hero', route: '/services', ref: 4, copy: servicesHero },
  { id: 'list', route: '/services', ref: 7, copy: servicesList },
  { id: 'faq', route: '/services', ref: 14, refRoute: '/', copy: servicesFaq },

  { id: 'title', route: '/contact', ref: 4, copy: contactTitle },
  { id: 'form', route: '/contact', ref: 8, copy: contactForm },
  { id: 'nap-card', route: '/contact', ref: null, copy: contactNap },
  { id: 'map', route: '/contact', ref: 5, copy: contactMap },

  { id: 'body', route: '/privacy', ref: null, copy: privacy },
];

/* --------------------------------------------------------------------------
 * `routes` — the SHARED harness's view of this file (A-11).
 *
 * `../_shared/harness/src/similarity.mjs` reads `copy.routes[route].sections[]`
 * and expects `refSection` in the contract's `sNN-...` form plus the divergence
 * class. This file was written to the legacy per-site shape (`sections[]` with a
 * numeric `ref`), which is the same defect class as KD-09: the shared instrument
 * has one format and this site conforms to it rather than forking the package.
 *
 * This is a projection of the arrays above. It holds no copy of its own — every
 * string still has exactly one home — so the two cannot drift.
 * ------------------------------------------------------------------------ */

/** Divergence class per `route::id`, mirroring docs/sections.md. */
const CLASS_BY_KEY: Readonly<Record<string, 'FIDELITY' | 'ADAPTED' | 'NOVEL'>> = {
  '/::header': 'ADAPTED',
  '/::callbar': 'NOVEL',
  '/::footer-nap': 'ADAPTED',
  '/::footer-links': 'ADAPTED',
  '/::hero': 'ADAPTED',
  '/::trust-row': 'ADAPTED',
  '/::svc-a': 'ADAPTED',
  '/::svc-b': 'ADAPTED',
  '/::svc-c': 'ADAPTED',
  '/::intro': 'ADAPTED',
  '/::projects': 'FIDELITY',
  '/::testimonials': 'ADAPTED',
  '/::map': 'NOVEL',
  '/::cta-band': 'FIDELITY',
  '/about::title': 'ADAPTED',
  '/about::story': 'ADAPTED',
  '/about::what-we-do': 'ADAPTED',
  '/about::credentials': 'NOVEL',
  '/services::hero': 'ADAPTED',
  '/services::list': 'ADAPTED',
  '/services::faq': 'ADAPTED',
  '/contact::title': 'ADAPTED',
  '/contact::form': 'ADAPTED',
  '/contact::nap-card': 'NOVEL',
  '/contact::map': 'ADAPTED',
  '/privacy::body': 'NOVEL',
};

const ROUTE_ORDER: readonly Route[] = ['/', '/about', '/services', '/contact', '/privacy'];

export const routes = Object.fromEntries(
  ROUTE_ORDER.map((route) => [
    route,
    {
      meta: meta[route],
      sections: sections
        .filter((s) => s.route === route)
        .map((s) => ({
          id: s.id,
          // sNN- is the contract's reference-section form; refIdx() parses the digits.
          refSection: s.ref == null ? null : `s${String(s.ref).padStart(2, '0')}`,
          cls: CLASS_BY_KEY[`${route}::${s.id}`] ?? 'NOVEL',
          copy: s.copy,
        })),
    },
  ])
) as unknown as Readonly<Record<Route, { meta: Meta; sections: readonly {
  id: string;
  refSection: string | null;
  cls: string;
  copy: CopyNode;
}[] }>>;

export const copy = { meta, sections, routes } as const;
export default copy;
