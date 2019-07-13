import { trigger, style, transition, animate, query, stagger, state } from '@angular/animations';

export const animations = [
    trigger('fadeDrop', [
        transition('* => *', [
            query('span', style({ opacity: 0, position: 'relative', top: '-20px' })),
            query('span',
                stagger('75ms', animate('100ms ease-out', style({
                    opacity: 1,
                    top: '0'
                })))
            ),
        ]),
    ]),

    trigger('highlight', [
        state('closed', style({
            width: '0vw',
            paddingLeft: '0px',
            paddingRight: '0px',
        })),
        state('open', style({
            width: '42vw',
            paddingLeft: '15px',
            paddingRight: '15px',
        })),
        transition('closed => open', [
            query(':self',
                (animate('750ms ease-out')),
                { delay: 100 }
            )
        ])
    ]),

    trigger('highlightText', [
        state('grey', style({
            color: '#252425'
        })),
        state('black', style({
            color: '#181718',
        })),
        transition('grey => black', [
            query(':self',
                (animate('100ms ease-out')),
                { delay: 750 }
            )
        ])
    ])
]