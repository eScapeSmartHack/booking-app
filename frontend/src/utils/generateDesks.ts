import { Desk } from '@/types/desk';

/**
 * Generates 216 desk points based on actual measured positions from the floor plan
 * Uses the provided sample positions to calculate spacing and generate all desks
 */
export function generate216Desks(): Desk[] {
  const desks: Desk[] = [];
  let deskNumber = 1;

  // Helper function to generate desk name
  const getDeskName = (num: number): string => {
    return String(num);
  };

  // Based on provided sample positions:
  // Top section - 4 columns, starting at x ~23.62, 24.66, 26.76, 27.79
  // Column spacing: ~1.04, ~2.10, ~1.03 (average ~1.39)
  // Row spacing: ~1.2-1.3 (average ~1.25)
  // Starting y: ~11.2

  // Bottom section - starting at y ~28.94
  // Similar column and row spacing

  // BLOCK 1: Left side - Upper section
  // Starting position: x ~23.62, y ~11.2
  const block1UpperStartX = 23.62;
  const block1UpperStartY = 11.2;
  const block1ColSpacing = 1.04; // Average spacing between columns
  const block1RowSpacing = 1.25; // Average spacing between rows
  const block1Cols = 3;
  const block1Rows = 9;

  for (let col = 0; col < block1Cols; col++) {
    for (let row = 0; row < block1Rows; row++) {
      const x = block1UpperStartX + (col * block1ColSpacing);
      const y = block1UpperStartY + (row * block1RowSpacing);
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x, y },
        status: 'available',
        floor: '4',
      });
      deskNumber++;
    }
  }

  // BLOCK 1: Left side - Lower section
  // Starting position: x ~23.62, y ~28.94
  const block1LowerStartY = 28.94;
  for (let col = 0; col < block1Cols; col++) {
    for (let row = 0; row < block1Rows; row++) {
      const x = block1UpperStartX + (col * block1ColSpacing);
      const y = block1LowerStartY + (row * block1RowSpacing);
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x, y },
        status: 'available',
        floor: '4',
      });
      deskNumber++;
    }
  }

  // BLOCK 2: Left-middle - Upper section
  // Starting position: x ~24.66 (from sample), y ~11.2
  const block2UpperStartX = 24.66;
  const block2ColSpacing = 2.10; // Larger gap between block 1 and 2
  for (let col = 0; col < block1Cols; col++) {
    for (let row = 0; row < block1Rows; row++) {
      const x = block2UpperStartX + (col * block1ColSpacing);
      const y = block1UpperStartY + (row * block1RowSpacing);
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x, y },
        status: 'available',
        floor: '4',
      });
      deskNumber++;
    }
  }

  // BLOCK 2: Left-middle - Lower section
  for (let col = 0; col < block1Cols; col++) {
    for (let row = 0; row < block1Rows; row++) {
      const x = block2UpperStartX + (col * block1ColSpacing);
      const y = block1LowerStartY + (row * block1RowSpacing);
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x, y },
        status: 'available',
        floor: '4',
      });
      deskNumber++;
    }
  }

  // BLOCK 3: Right-middle - Upper section
  // Starting position: x ~26.76 (from sample)
  const block3UpperStartX = 26.76;
  for (let col = 0; col < block1Cols; col++) {
    for (let row = 0; row < block1Rows; row++) {
      const x = block3UpperStartX + (col * block1ColSpacing);
      const y = block1UpperStartY + (row * block1RowSpacing);
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x, y },
        status: 'available',
        floor: '4',
      });
      deskNumber++;
    }
  }

  // BLOCK 3: Right-middle - Lower section
  for (let col = 0; col < block1Cols; col++) {
    for (let row = 0; row < block1Rows; row++) {
      const x = block3UpperStartX + (col * block1ColSpacing);
      const y = block1LowerStartY + (row * block1RowSpacing);
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x, y },
        status: 'available',
        floor: '4',
      });
      deskNumber++;
    }
  }

  // BLOCK 4: Right side - Upper section
  // Starting position: x ~27.79 (from sample)
  const block4UpperStartX = 27.79;
  for (let col = 0; col < block1Cols; col++) {
    for (let row = 0; row < block1Rows; row++) {
      const x = block4UpperStartX + (col * block1ColSpacing);
      const y = block1UpperStartY + (row * block1RowSpacing);
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x, y },
        status: 'available',
        floor: '4',
      });
      deskNumber++;
    }
  }

  // BLOCK 4: Right side - Lower section
  for (let col = 0; col < block1Cols; col++) {
    for (let row = 0; row < block1Rows; row++) {
      const x = block4UpperStartX + (col * block1ColSpacing);
      const y = block1LowerStartY + (row * block1RowSpacing);
      desks.push({
        id: `desk-${deskNumber}`,
        name: getDeskName(deskNumber),
        position: { x, y },
        status: 'available',
        floor: '4',
      });
      deskNumber++;
    }
  }

  // Total: 8 sections × 27 desks = 216 desks
  return desks;
}
