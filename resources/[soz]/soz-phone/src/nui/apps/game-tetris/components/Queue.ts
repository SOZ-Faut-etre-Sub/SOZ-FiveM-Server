import { Piece, pieces } from './Piece';

export type PieceQueue = {
  minimumLength: number;
  queue: Piece[];
  bucket: Piece[];
};

export function create(minimumLength: number): PieceQueue {
  return fill({
    minimumLength,
    queue: [],
    bucket: []
  });
}

function fill(pieceQueue: PieceQueue): PieceQueue {
  const local: Piece[] = [];
  let bucket = pieceQueue.bucket;
  while (local.length + pieceQueue.queue.length < pieceQueue.minimumLength) {
    const [piece, updatedBucket] = getFromBucket(bucket);
    local.push(piece);
    bucket = updatedBucket;
  }

  return {
    ...pieceQueue,
    queue: pieceQueue.queue.concat(local)
  };
}

export function getNextPiece(pieceQueue: PieceQueue): {
  piece: Piece;
  queue: PieceQueue;
} {
  if (!pieceQueue.queue[0]) {
    throw new Error('Error queue is empty');
  }
  const next = pieceQueue.queue[0];
  const queue = pieceQueue.queue.slice(1);
  return {
    piece: next,
    queue: fill({
      ...pieceQueue,
      queue
    })
  };
}

function getFromBucket(bucket: Piece[]): [Piece, Piece[]] {
  const local = bucket.slice(0);
  if (local.length === 0) {
    // fill the bucket
    pieces.forEach((piece) => {
      for (let i = 0; i < 4; i++) {
        local.push(piece);
      }
    });
  }
  const randomPiece = local.splice(randomNumber(local.length), 1)[0];
  if (!randomPiece) {
    throw new Error(`Error bucket pull`);
  }
  return [randomPiece, local];
}

export default PieceQueue;

function randomNumber(under: number): number {
  return Math.floor(Math.random() * under);
}
