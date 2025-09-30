const archetypeData = {
    'Vanguard': [
        'Pioneer', 
        'Charger', 
        'Flagbearer', 
        'Agent', 
        'Tactician', 
        'Standard Bearer',
        'Strategist'
    ],
    'Guard': [
        'Lord', 
        'Arts Fighter', 
        'Centurion', 
        'Dreadnought', 
        'Duelist', 
        'Fighter', 
        'Instructor', 
        'Reaper', 
        'Swordmaster', 
        'Liberator', 
        'Crusher',
        'Soloblade',
        'Earthshaker',
        'Primal'
    ],
    'Defender': [
        'Protector', 
        'Guardian', 
        'Arts Protector', 
        'Juggervoid', 
        'Sentinel', 
        'Fortress'
    ],
    'Sniper': [
        'Marksman', 
        'Deadeye', 
        'Heavyshooter', 
        'Flinger', 
        'Besieger', 
        'Spreadshooter', 
        'Artilleryman',
        'Hunter',
        'Loopshooter'
    ],
    'Caster': [
        'Core Caster', 
        'Splash Caster', 
        'Mech-Accord Caster', 
        'Mystic Caster', 
        'Phalanx Caster', 
        'Blast Caster', 
        'Chain Caster',
        'Primal Caster',
        'Shaper Caster'
    ],
    'Medic': [
        'Medic', 
        'Multi-target Medic', 
        'Wandering Medic', 
        'Therapist Medic', 
        'Incantation Medic',
        'Chain Medic'
    ],
    'Support': [
        'Decel Binder', 
        'Abjurer', 
        'Artificer', 
        'Bard', 
        'Hexer', 
        'Summoner',
        'Ritualist'
    ],
    'Specialist': [
        'Push Stroker', 
        'Ambusher', 
        'Dollkeeper', 
        'Executor', 
        'Geek', 
        'Merchant', 
        'Trapmaster',
        'Hookmaster',
        'Alchemist',
        'Skyranger'
    ]
};

const archetypeTraits = {
    // Vanguard
    'Pioneer': 'Steadily generate DP with skills.',
    'Charger': 'Generates 1 DP when defeating an enemy and refunds the base DP cost when retreated.',
    'Flagbearer': 'Does not attack or block enemies while the skill is not active; Generates DP over time.',
    'Agent': 'Has a shorter redeployment time of 35 seconds and a range of two tiles ahead, and generate DP in each attack while the skill is active',
    'Tactician': 'Ranged, unlike other Vanguards; can deploy a Reinforcement within attack range and attacks deal 1.5× damage against enemies being blocked by the Reinforcement(s)',
    'Standard Bearer': 'Rapidly generate DP with skills but can neither attack nor block enemies while the skill is active.',
    'Strategist': 'Steadily generate DP with skills, can provide support to undeployed operators with their talent and skills',
    // Guard
    'Lord': 'Has a ranged attack that deals 0.8× damage, which is used while not blocking enemies.',
    'Arts Fighter': 'Attacks deal Arts damage.',
    'Centurion': 'Attacks multiple enemies equal to Block Count.',
    'Dreadnought': 'High HP and ATK. Blocks 1 enemy.',
    'Duelist': 'Cannot be healed by allies. Recovers HP for every attack on an enemy.',
    'Fighter': 'Has a very low attack interval.',
    'Instructor': 'Has a range of two tiles ahead and attacks deal 1.2× damage against enemies not blocked by self; supports friendlies with skills.',
    'Reaper': 'Attacks hit all enemies within a vertical range of three tiles ahead, cannot be actively healed by friendlies, and restores slight HP for every enemy hit in each attack up to the block count',
    'Swordmaster': 'Attacks deal two consecutive hits (but are still considered as one attack).',
    'Liberator': 'Only attack and block enemies when the skill is active, and have increased ATK over time when the skill is not active (up to a limit and will be lost when the skill expires upon activation); has a range of the frontal and side tiles',
    'Crusher': 'Attacks hit multiple targets equal to block count and have extremely high HP and ATK, but have no defenses whatsoever and a high attack interval.',
    'Soloblade': 'Cannot be actively healed by friendlies and restores slight HP in each attack.',
    'Earthshaker': 'Attacks deal half-strength splash damage affecting enemies near the main target',
    'Primal': 'Can deal Elemental damage against enemies being affected by the burst effect of Elemental Injury',
    // Defender
    'Protector': 'Blocks 3 enemies.',
    'Guardian': 'Can heal allies.',
    'Arts Protector': 'When skill is not active, deals Arts damage to all blocked enemies when attacked.',
    'Juggervoid': 'Significantly increased Max HP and DEF. Does not get deployment limit refunded upon retreat.',
    'Sentinel': 'When not blocking any enemies, gains increased DEF and RES.',
    'Fortress': 'When skill is active, attacks deal AoE Physical damage.',
    // Sniper
    'Marksman': 'Prioritizes attacking aerial enemies.',
    'Deadeye': 'Has a long range and attacks enemies with the lowest DEF over the others.',
    'Heavyshooter': 'Has a short range but high ATK.',
    'Flinger': 'Attacks deal two consecutive hits with the second dealing half damage and can only target ground enemies.',
    'Besieger': 'Has a minimum range of the frontal tiles and attacks enemies with the highest weight over the others.',
    'Spreadshooter': 'Attacks damage all enemies in range with those in the frontal row taking 1.5× damage',
    'Artilleryman': 'Attacks deal AOE damage',
    'Hunter': 'Only attacks while having ammunition which deals 1.2× damage and reloaded over time if no enemies are in range.',
    'Loopshooter': 'Uses a boomerang-like projectile to attack with a long and wide range, but must wait until the projectile returns to attack again.',
    // Caster
    'Core Caster': 'Deals Arts damage.',
    'Splash Caster': 'Deals AoE Arts damage.',
    'Mech-Accord Caster': 'Controls a drone that attacks enemies independently, dealing more damage in successive attacks against the same target.',
    'Mystic Caster': 'Store attacks if no enemies are in range (up to 3), which are simultaneously released in the next attack.',
    'Phalanx Caster': 'Only attacks while the skill is active, which damages all enemies in range; has greatly increased DEF and RES while the skill is not active.',
    'Blast Caster': 'Attacks damage all enemies in a long linear range.',
    'Chain Caster': 'Attacks jump between multiple targets and temporarily Slow them, but deals 15% less damage in each jump.',
    'Primal Caster': 'Can deal Elemental damage against enemies being affected by the burst effect of Elemental Injury',
    'Shaper Caster': 'Obtains a summon when defeating an enemy, and can attack enemies blocked by own summons',
    // Medic
    'Medic': 'Heals one target at a time.',
    'Multi-target Medic': 'Heals up to three targets simultaneously.',
    'Wandering Medic': 'Can remove Elemental Injury on friendlies, even if the target is at full HP, for half the ATK',
    'Therapist Medic': 'Heal targets at a wide range with 80% effectiveness on further targets.',
    'Incantation Medic': 'Attacks enemies instead of healing friendlies, unlike other Medics, but heals a friendly unit within range for half the ATK in each attack.',
    'Chain Medic': 'Healing jumps between multiple targets but restores 25% less HP in each jump.',
    // Support
    'Decel Binder': 'Attacks temporarily Slow the target.',
    'Abjurer': 'Augments the defensive capabilities of friendly units and heals friendlies instead of attacking enemies for 0.75× ATK while the skill is active.',
    'Artificer': 'Melee and attacks deal Physical damage, unlike other Supporters; can utilize Support Devices to augment friendlies.',
    'Bard': 'Does not attack but passively heal friendlies within range; can Inspire friendlies but are unaffected by Inspiration (including from themselves).',
    'Hexer': 'Weaken enemies defensive and/or offensive capabilities.',
    'Summoner': 'Can utilize summons.',
    'Ritualist': 'Can inflict Elemental Injury on enemies',
    // Specialist
    'Push Stroker': 'Melee, but can be deployed on ranged tiles; can push away enemies with skills and attacks hit multiple targets equal to block count.',
    'Ambusher': 'Melee; attacks hit all enemies in range, can dodge Physical and Arts attacks 50% of the time, and has reduced aggression.',
    'Dollkeeper': 'Melee; temporarily replaced by a Substitute which cannot block enemies upon losing all HP, but must be redeployed if the Substitute is defeated.',
    'Executor': 'Melee; has a much shorter redeployment time of 18 seconds (with the sole exception to THRM-EX).',
    'Geek': 'Ranged; causes "friendly fire" to buff friendlies and degenerates HP over time.',
    'Merchant': 'Melee; has a shorter redeployment time of 25 seconds but drains 3 DP every 3 seconds while deployed and will be automatically retreated if there are not enough DP, and does not return DP when retreated.',
    'Trapmaster': 'Ranged; can use traps which must be deployed on tiles without enemies.',
    'Hookmaster': 'Melee, but can be deployed on ranged tiles; can pull in enemies with skills and has a range of several tiles ahead.',
    'Alchemist': 'Ranged; can throw Alchemy units to provide various beneficial/debilitating effects to allies or enemies.',
    'Skyranger': 'Melee; can take off with skills to block aerial enemies.'
};

const races = ['Aegir', 'Anasa', 'Anaty', 'Archosauria', 'Aslan', 'Caprinae', 'Cautus', 'Cerato', 'Chimera', 'Draco', 'Durin', 'Elafia', 'Feline', 'Forte', 'Itra', 'Kuranta', 'Liberi', 'Lupo', 'Lung', 'Oni', 'Perro', 'Petram', 'Pilosa', 'Pythia', 'Reptilia', 'Sankta', 'Sarkaz', 'Savra', 'Ursus', 'Vouivre', 'Vulpo', 'Zalak', 'Not specified'];
const physicalRatings = ['Flawed', 'Poor', 'Standard', 'Good', 'Excellent', 'Outstanding'];