import {Liveblocks} from '@liveblocks/node';

const key = process.env.LIVE_BLOCKS_SECRET_KEY;

if(!key){
  throw new Error('LIVE_BLOCKS_SECRET_KEY not found');
}

const liveblocks = new Liveblocks({
    secret: key,
});

export default liveblocks;