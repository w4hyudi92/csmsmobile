import { NgModule } from '@angular/core';
import { SearchPipe } from './search/search';
import { SortPipe } from './sort/sort';
import { SearchtglPipe } from './searchtgl/searchtgl';
import { CariPipe } from './cari/cari';
import { CariReturPipe } from './cari-retur/cari-retur';
import { CariRentalPipe } from './cari-rental/cari-rental';
import { DateformatPipe } from './dateformat/dateformat';
import { PhonesPipe } from './phones/phones';
import { CariteknisiPipe } from './cariteknisi/cariteknisi';
import { CariRonPipe } from './cari-ron/cari-ron';
@NgModule({
	declarations: [SearchPipe,
        SortPipe,
        SearchtglPipe,
        CariPipe,
    CariReturPipe,
    CariRentalPipe,
    DateformatPipe,
    PhonesPipe,
    CariteknisiPipe,
    CariRonPipe
    ],
	imports: [],
	exports: [SearchPipe,
        SortPipe,
        SearchtglPipe,
        CariPipe,
    CariReturPipe,
    CariRentalPipe,
    DateformatPipe,
    PhonesPipe,
    CariteknisiPipe,
    CariRonPipe
    ]
})
export class PipesModule {}
