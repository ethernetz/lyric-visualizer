import { trigger, style, transition, animate, query, stagger, state } from '@angular/animations';

export const animations = [
    trigger('fadeDrop', [
        transition(":enter", [
            query('span', style({ opacity: 0, position: 'relative', top: '-20px' })),
            query('span',
                stagger('125ms',
                    animate('500ms cubic-bezier(0.23, 1, 0.32, 1)',
                        style({
                            opacity: 1,
                            top: '0'
                        })
                    )
                ), { delay: 100 }
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
                (animate('750ms cubic-bezier(0.23, 1, 0.32, 1)')),
                { delay: 300 }
            )
        ]),
        transition('open => closed', [
            query(':self',
                (animate('750ms cubic-bezier(0.23, 1, 0.32, 1)')),
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
                (animate('100ms cubic-bezier(0.23, 1, 0.32, 1)')),
                { delay: 750 }
            )
        ]),
        transition('black => grey', [
            query(':self',
                (animate('100ms cubic-bezier(0.23, 1, 0.32, 1)')),
                { delay: 50 }
            )
        ])
    ]),

    trigger('raiseHighlight', [
        transition('* => *', [
            query(":self", style({
                transform: 'translateY(0)',
            })),
            query(":self", animate('500ms cubic-bezier(0.23, 1, 0.32, 1)', style({
                transform: 'translateY(-8.5vw)',
            })))
        ])
    ]),
]