import { Desk } from '@/types/desk';

/**
 * Generates 216 desk points based on actual measured positions
 * Replicates the pattern from provided sample positions
 */
export function generate216Desks(): Desk[] {
  const desks: Desk[] = [];
  let deskNumber = 1;

  // Helper function to generate desk name
  const getDeskName = (num: number): string => {
    return `Desk${num}`;
  };

  // TOP SECTION - Upper area
  
  // GROUP 1 (Complete - 6 desks): Make uniform on Ox axis
  // Extract unique x positions: ~23.62, 24.66
  const group1TopXPositions = [
    23.623853211009173, // Average of column 1
    24.67847105552976,  // Average of column 2
  ];
  const group1TopBaseY = 11.201866977829638; // First row y position
  const group1TopRowSpacing = 1.25; // Average spacing between rows
  
  // Generate 3 rows × 2 columns = 6 desks
  for (let row = 0; row < 3; row++) {
    group1TopXPositions.forEach(x => {
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { 
          x: x, 
          y: group1TopBaseY + (row * group1TopRowSpacing) 
        },
        floor: '4',
        type: 'desk',
      });
      deskNumber++;
    });
  }

  // GROUP 2 (Complete - 6 desks): Make uniform on Ox axis
  // Extract unique x positions: ~26.76, 27.79
  const group2TopXPositions = [
    26.758409785932724, // Average of column 1
    27.79051987767584,  // Average of column 2
  ];
  const group2TopBaseY = 11.240762349280436; // First row y position
  const group2TopRowSpacing = 1.25; // Average spacing between rows
  
  // Generate 3 rows × 2 columns = 6 desks
  for (let row = 0; row < 3; row++) {
    group2TopXPositions.forEach(x => {
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { 
          x: x, 
          y: group2TopBaseY + (row * group2TopRowSpacing) 
        },
        floor: '4',
        type: 'desk',
      });
      deskNumber++;
    });
  }

  // Calculate spacing for replication
  const rowSpacing = 1.25; // Average spacing between rows
  const colSpacing1 = 1.04; // Spacing in group 1
  const colSpacing2 = 1.03; // Spacing in group 2

  // GROUP 3-12 (Only first row of 2 desks each, need to replicate 2 more rows down)
  // Group 3: x ~30.20, 31.27
  const group3Row1 = [
    { x: 30.198513141555022, y: 11.129491326792653 },
    { x: 31.268539197751856, y: 11.189977692699136 },
  ];
  
  // Group 4: x ~33.41, 34.42
  const group4Row1 = [
    { x: 33.40859017032227, y: 11.189977796991885 },
    { x: 34.41917030002953, y: 11.25046416346211 },
  ];
  
  // Group 5: x ~36.80, 37.81
  const group5Row1 = [
    { x: 36.79700715476882, y: 11.129491326792653 },
    { x: 37.80758731895471, y: 11.129491326792653 },
  ];
  
  // Group 6: x ~39.89, 41.02
  const group6Row1 = [
    { x: 39.88819353933744, y: 11.129491326792653 },
    { x: 41.01766548754521, y: 11.189977692699136 },
  ];
  
  // Group 7: x ~43.45, 44.35
  const group7Row1 = [
    { x: 43.45494705999355, y: 11.129491326792653 },
    { x: 44.34663544015757, y: 11.189977692699136 },
  ];
  
  // Group 8: x ~46.78, 47.62
  const group8Row1 = [
    { x: 46.78391701260591, y: 11.069004960886172 },
    { x: 47.616159500759004, y: 11.250464058605617 },
  ];
  
  // Group 9: x ~53.65, 54.76
  const group9Row1 = [
    { x: 53.65361109634904, y: 11.33382675494182 },
    { x: 54.75899452622629, y: 11.377085635685873 },
  ];
  
  // Group 10: x ~56.84, 57.82
  const group10Row1 = [
    { x: 56.84221714407185, y: 11.377085635685873 },
    { x: 57.82005633204018, y: 11.33382675494182 },
  ];
  
  // Group 11: x ~60.29, 61.18
  const group11Row1 = [
    { x: 60.28591167561248, y: 11.160791231965609 },
    { x: 61.17872136897486, y: 11.160791231965609 },
  ];
  
  // Group 12: x ~63.43, 64.45
  const group12Row1 = [
    { x: 63.43200297603231, y: 11.074273470477504 },
    { x: 64.45235691130361, y: 11.290567874197768 },
  ];
  
  // Group 13: x ~66.88, 67.90
  const group13Row1 = [
    { x: 66.87569750757294, y: 11.247308993453714 },
    { x: 67.89605144284424, y: 11.247308993453714 },
  ];
  
  // Group 14: x ~69.98, 71.08
  const group14Row1 = [
    { x: 69.9792740606898, y: 11.117532351221557 },
    { x: 71.08465749056704, y: 11.247308993453714 },
  ];
  
  // Group 15: x ~73.47, 74.57
  const group15Row1 = [
    { x: 73.46548333953339, y: 11.204050112709663 },
    { x: 74.57086676941064, y: 11.117532351221557 },
  ];
  
  // Group 16: x ~76.82, 77.84
  const group16Row1 = [
    { x: 76.82414837646809, y: 11.204050112709663 },
    { x: 77.84450231173938, y: 11.117532351221557 },
  ];
  
  // Group 17: x ~79.97, 80.99
  const group17Row1 = [
    { x: 79.97023967688793, y: 11.160791231965609 },
    { x: 80.9905921218051, y: 11.204049559150327 },
  ];
  
  // Group 18: x ~83.33, 84.21
  const group18Row1 = [
    { x: 83.32890471382261, y: 11.204050112709663 },
    { x: 84.2125382262997, y: 11.240762349280436 },
  ];

  // Replicate groups 3-18: add 2 more rows down (3 rows total per group)
  // Align all rows on Ox axis by using the same x positions
  const groupsTop = [
    group3Row1, group4Row1, group5Row1, group6Row1, group7Row1, group8Row1,
    group9Row1, group10Row1, group11Row1, group12Row1, group13Row1, group14Row1,
    group15Row1, group16Row1, group17Row1, group18Row1
  ];

  groupsTop.forEach(group => {
    // Extract x positions from first row (these will be used for all rows)
    const xPositions = group.map(pos => pos.x);
    const baseY = group[0].y; // Use first desk's y as base
    
    // Row 1 (already provided - use exact positions)
    group.forEach((pos, idx) => {
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x: xPositions[idx], y: baseY },
        floor: '4',
        type: 'desk',
      });
      deskNumber++;
    });
    
    // Row 2 (replicate down with same x positions)
    xPositions.forEach(x => {
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x: x, y: baseY + rowSpacing },
        floor: '4',
        type: 'desk',
      });
      deskNumber++;
    });
    
    // Row 3 (replicate down with same x positions)
    xPositions.forEach(x => {
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x: x, y: baseY + (rowSpacing * 2) },
        floor: '4',
        type: 'desk',
      });
      deskNumber++;
    });
  });

  // BOTTOM SECTION - Lower area
  
  // GROUP 1 (Complete - 6 desks): Make uniform on Ox axis
  // Extract unique x positions: ~23.62, 24.58
  const group1BottomXPositions = [
    23.623853211009173, // Column 1 (all same x)
    24.579510703363912, // Average of column 2
  ];
  const group1BottomBaseY = 28.93815635939323; // First row y position
  const group1BottomRowSpacing = 1.25; // Average spacing between rows
  
  // Generate 3 rows × 2 columns = 6 desks
  for (let row = 0; row < 3; row++) {
    group1BottomXPositions.forEach(x => {
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { 
          x: x, 
          y: group1BottomBaseY + (row * group1BottomRowSpacing) 
        },
        floor: '4',
        type: 'desk',
      });
      deskNumber++;
    });
  }

  // GROUP 2-24 (Only first row of 2 desks each, need to replicate 2 more rows down)
  // Group 2: x ~26.82, 27.98
  const group2BottomRow1 = [
    { x: 26.820201814062422, y: 28.80844571580994 },
    { x: 27.975829899408023, y: 28.955427581706928 },
  ];
  
  // Group 3: x ~30.29, 31.30
  const group3BottomRow1 = [
    { x: 30.287086070099217, y: 28.955427581706928 },
    { x: 31.298260644776615, y: 28.857439671108935 },
  ];
  
  // Group 4: x ~33.47, 34.52
  const group4BottomRow1 = [
    { x: 33.465063304799614, y: 28.80844571580994 },
    { x: 34.52438904969974, y: 28.80844571580994 },
  ];
  
  // Group 5: x ~36.74, 37.80
  const group5BottomRow1 = [
    { x: 36.739342879945475, y: 28.906433626407935 },
    { x: 37.798668624845604, y: 28.906433626407935 },
  ];
  
  // Group 6: x ~40.06, 40.98
  const group6BottomRow1 = [
    { x: 40.06177362531407, y: 28.955427581706928 },
    { x: 40.97664642402997, y: 28.857440579280315 },
  ];
  
  // Group 7: x ~43.43, 44.40
  const group7BottomRow1 = [
    { x: 43.43235554090539, y: 28.80844571580994 },
    { x: 44.39537894536006, y: 28.857439671108935 },
  ];
  
  // Group 8: x ~46.85, 47.72
  const group8BottomRow1 = [
    { x: 46.85108862671946, y: 28.80844571580994 },
    { x: 47.71780969072865, y: 28.759451760510945 },
  ];
  
  // Group 9: x ~53.64, 54.60
  const group9BottomRow1 = [
    { x: 53.640403628124844, y: 28.906433626407935 },
    { x: 54.60342703257951, y: 28.857439671108935 },
  ];
  
  // Group 10: x ~56.82, 57.83
  const group10BottomRow1 = [
    { x: 56.81838086282524, y: 28.857439671108935 },
    { x: 57.829555437502634, y: 28.906433626407935 },
  ];
  
  // Group 11: x ~60.24, 61.30
  const group11BottomRow1 = [
    { x: 60.2371139486393, y: 28.71045780521195 },
    { x: 61.296439693539426, y: 28.80844571580994 },
  ];
  
  // Group 12: x ~63.61, 64.52
  const group12BottomRow1 = [
    { x: 63.60769586423063, y: 28.857439671108935 },
    { x: 64.52256809846256, y: 28.955427581706928 },
  ];
  
  // Group 13: x ~66.98, 67.94
  const group13BottomRow1 = [
    { x: 66.97827777982197, y: 28.906433626407935 },
    { x: 67.94130118427663, y: 28.80844571580994 },
  ];
  
  // Group 14: x ~70.11, 71.12
  const group14BottomRow1 = [
    { x: 70.10810384429962, y: 28.955427581706928 },
    { x: 71.11927841897702, y: 28.80844571580994 },
  ];
  
  // Group 15: x ~73.48, 74.49
  const group15BottomRow1 = [
    { x: 73.47868575989095, y: 28.857439671108935 },
    { x: 74.48986033456835, y: 28.857439671108935 },
  ];
  
  // Group 16: x ~76.75, 77.62
  const group16BottomRow1 = [
    { x: 76.7529653350368, y: 28.906433626407935 },
    { x: 77.619686399046, y: 28.955427581706928 },
  ];
  
  // Group 17: x ~80.12, 80.99
  const group17BottomRow1 = [
    { x: 80.12354725062814, y: 28.857439671108935 },
    { x: 80.99026831463733, y: 28.906433626407935 },
  ];
  
  // Group 18: x ~83.45, 84.31
  const group18BottomRow1 = [
    { x: 83.44597799599673, y: 28.80844571580994 },
    { x: 84.31269906000593, y: 28.955427581706928 },
  ];

  // Replicate groups 2-18 bottom: add 2 more rows down (3 rows total per group)
  // Align all rows on Ox axis by using the same x positions
  const groupsBottom = [
    group2BottomRow1, group3BottomRow1, group4BottomRow1, group5BottomRow1,
    group6BottomRow1, group7BottomRow1, group8BottomRow1, group9BottomRow1,
    group10BottomRow1, group11BottomRow1, group12BottomRow1, group13BottomRow1,
    group14BottomRow1, group15BottomRow1, group16BottomRow1, group17BottomRow1,
    group18BottomRow1
  ];

  groupsBottom.forEach(group => {
    // Extract x positions from first row (these will be used for all rows)
    const xPositions = group.map(pos => pos.x);
    const baseY = group[0].y; // Use first desk's y as base
    
    // Row 1 (already provided - use exact positions)
    group.forEach((pos, idx) => {
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x: xPositions[idx], y: baseY },
        floor: '4',
        type: 'desk',
      });
      deskNumber++;
    });
    
    // Row 2 (replicate down with same x positions)
    xPositions.forEach(x => {
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x: x, y: baseY + rowSpacing },
        floor: '4',
        type: 'desk',
      });
      deskNumber++;
    });
    
    // Row 3 (replicate down with same x positions)
    xPositions.forEach(x => {
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x: x, y: baseY + (rowSpacing * 2) },
        floor: '4',
        type: 'desk',
      });
      deskNumber++;
    });
  });

  // Ensure we have exactly 216 desks
  const finalDesks = desks.slice(0, 216);

  // Add meeting rooms
  const meetingRooms: Desk[] = [
    {
      id: 'desk-1762613213793',
      name: 'Meeting1',
      position: { x: 17.431192660550458, y: 9.762738234150136 },
      floor: '4',
      type: 'meeting-room',
      capacity: 4,
      bookings: [
        {
          deskId: 'desk-1762613213793',
          userName: 'You',
          date: '2025-11-12',
          startTime: '10:30',
          endTime: '14:30',
          duration: 240,
        },
      ],
    },
    {
      id: 'desk-1762613540188',
      name: 'Meet2',
      position: { x: 17.46941896024465, y: 13.263321664721897 },
      floor: '4',
      type: 'meeting-room',
      capacity: 4,
    },
    {
      id: 'desk-1762613551320',
      name: 'Meet3',
      position: { x: 17.46941896024465, y: 29.28821470245041 },
      floor: '4',
      type: 'meeting-room',
      capacity: 4,
    },
    {
      id: 'desk-1762613562114',
      name: 'Meet4',
      position: { x: 17.431192660550458, y: 32.86658887592376 },
      floor: '4',
      type: 'meeting-room',
      capacity: 4,
    },
    {
      id: 'desk-1762613620906',
      name: 'Bubble1',
      position: { x: 21.21559633027523, y: 12.407623492804357 },
      floor: '4',
      type: 'meeting-room',
      capacity: 4,
    },
    {
      id: 'desk-1762613628650',
      name: 'Bubble2',
      position: { x: 21.21559633027523, y: 30.14391287436795 },
      floor: '4',
      type: 'meeting-room',
      capacity: 4,
    },
    {
      id: 'desk-1762613653498',
      name: 'Bubble3',
      position: { x: 50.764525993883794, y: 12.913263321664722 },
      floor: '4',
      type: 'meeting-room',
      capacity: 4,
    },
    {
      id: 'desk-1762613661040',
      name: 'Bubble4',
      position: { x: 50.57339449541285, y: 33.41112407623493 },
      floor: '4',
      type: 'meeting-room',
      capacity: 4,
    },
    {
      id: 'desk-1762613711838',
      name: 'Meet5',
      position: { x: 78.08836371853025, y: 24.31808801666425 },
      floor: '4',
      type: 'meeting-room',
      capacity: 4,
    },
    {
      id: 'desk-1762613732082',
      name: 'Meet6',
      position: { x: 87.76758409785933, y: 15.71373006612213 },
      floor: '4',
      type: 'meeting-room',
      capacity: 4,
    },
    {
      id: 'desk-1762615350628',
      name: 'Conference1',
      position: { x: 86.7914544541343, y: 20.469335701037515 },
      floor: '4',
      type: 'meeting-room',
      capacity: 4,
    },
    {
      id: 'desk-1762615357861',
      name: 'Conference2',
      position: { x: 82.06059066065882, y: 20.469335701037515 },
      floor: '4',
      type: 'meeting-room',
      capacity: 4,
    },
  ];

  // Add recreational spaces
  const recreationalSpaces: Desk[] = [
    {
      id: 'desk-1762618183234',
      name: 'Pool1',
      position: { x: 23.330338534813315, y: 19.473142104064937 },
      floor: '4',
      type: 'recreational',
      capacity: 4,
    },
    {
      id: 'desk-1762618390618',
      name: 'Pool2',
      position: { x: 23.335400975227184, y: 23.120493530717212 },
      floor: '4',
      type: 'recreational',
      capacity: 4,
    },
    {
      id: 'desk-1762618775966',
      name: 'Wellbeing',
      position: { x: 78.0853698666366, y: 19.84052797688666 },
      floor: '4',
      type: 'recreational',
      capacity: 4,
    },
  ];

  return [...finalDesks, ...meetingRooms, ...recreationalSpaces];
}
