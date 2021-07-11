import * as _ from 'lodash';
import * as __ from 'lodash/fp';
import * as $$ from 'rxjs';
import * as $ from 'rxjs/operators';

import { sub } from './lib';

const data = [1, 2, 3, 4];

const data$ = $$.of(data).pipe(
  $.switchAll(),
);

sub(data$);

