import { Direction } from './popover';

const attachments = <{[key: string]: any}>{
  top   : { attachment: 'bottom center', offset: '10px 0', opposite: 'bottom' },
  left  : { attachment: 'middle right', offset: '0 15px', opposite: 'right' },
  right : { attachment: 'middle left', offset: '0 -15px', opposite: 'left' },
  bottom: { attachment: 'top center', offset: '-10px 0', opposite: 'top' },
};

const PLACEMENTS = Object.keys(attachments).reduce((placements: any, direction: Direction) => {
  const { attachment, offset, opposite } = attachments[ direction ];
  const targetAttachment = attachments[ opposite ].attachment;

  placements[ direction ] = { opposite, attachment, targetAttachment, offset };
  return placements;
}, {});

export function placement( direction: Direction ) {
  return PLACEMENTS[ direction ];
}
