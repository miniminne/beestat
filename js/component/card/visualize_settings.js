/**
 * Visualize settings.
 */
beestat.component.card.visualize_settings = function() {
  const self = this;
  beestat.dispatcher.addEventListener('cache.floor_plan', function() {
    self.rerender();
  });

  beestat.component.card.apply(this, arguments);
};
beestat.extend(beestat.component.card.visualize_settings, beestat.component.card);

/**
 * Decorate
 *
 * @param {rocket.Elements} parent
 */
beestat.component.card.visualize_settings.prototype.decorate_contents_ = function(parent) {
  const grid_1 = document.createElement('div');
  Object.assign(grid_1.style, {
    'display': 'grid',
    'grid-template-columns': 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))',
    'grid-gap': `${beestat.style.size.gutter}px`,
    'margin-bottom': `${beestat.style.size.gutter}px`
  });
  parent.appendChild(grid_1);

  const type_container = document.createElement('div');
  this.decorate_data_type_(type_container);
  grid_1.appendChild(type_container);

  const time_period_container = document.createElement('div');
  this.decorate_time_period_(time_period_container);
  grid_1.appendChild(time_period_container);

  const grid_2 = document.createElement('div');
  Object.assign(grid_2.style, {
    'display': 'grid',
    'grid-template-columns': 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))',
    'grid-gap': `${beestat.style.size.gutter}px`
  });
  parent.appendChild(grid_2);

  const heat_map_type_container = document.createElement('div');
  this.decorate_heat_map_type_(heat_map_type_container);
  grid_2.appendChild(heat_map_type_container);
};

/**
 * Decorate the type options.
 *
 * @param {HTMLDivElement} parent
 */
beestat.component.card.visualize_settings.prototype.decorate_data_type_ = function(parent) {
  const self = this;

  (new beestat.component.title('Data Type')).render($(parent));

  const types = [
    {
      'code': 'temperature',
      'name': 'Temperature',
      'icon': 'thermometer'
    },
    {
      'code': 'occupancy',
      'name': 'Occupancy',
      'icon': 'eye'
    }
  ];

  const color = beestat.style.color.green.base;
  const tile_group = new beestat.component.tile_group();
  types.forEach(function(type) {
    const tile = new beestat.component.tile()
      .set_background_hover_color(color)
      .set_text_color('#fff')
      .set_icon(type.icon)
      .set_text(type.name);

    if (beestat.setting('visualize.data_type') === type.code) {
      tile.set_background_color(color);
    } else {
      tile
        .set_background_color(beestat.style.color.bluegray.light)
        .addEventListener('click', function() {
          beestat.setting('visualize.data_type', type.code);
          self.rerender();
        });
    }
    tile_group.add_tile(tile);
  });

  tile_group.render($(parent));
};
/**
 * Decorate the type options.
 *
 * @param {HTMLDivElement} parent
 */
beestat.component.card.visualize_settings.prototype.decorate_heat_map_type_ = function(parent) {
  const self = this;

  (new beestat.component.title('Heat Map Type')).render($(parent));

  const types = [
    {
      'code': 'relative',
      'name': 'Relative',
      'icon': 'arrow_expand_horizontal'
    },
    {
      'code': 'absolute',
      'name': 'Absolute',
      'icon': 'arrow_horizontal_lock'
    }
  ];

  const color = beestat.style.color.orange.base;
  const tile_group = new beestat.component.tile_group();
  types.forEach(function(type) {
    const tile = new beestat.component.tile()
      .set_background_hover_color(color)
      .set_text_color('#fff')
      .set_icon(type.icon)
      .set_text(type.name);

    if (beestat.setting('visualize.heat_map_type') === type.code) {
      tile.set_background_color(color);
    } else {
      tile
        .set_background_color(beestat.style.color.bluegray.light)
        .addEventListener('click', function() {
          beestat.setting('visualize.heat_map_type', type.code);
          self.rerender();
        });
    }
    tile_group.add_tile(tile);
  });
  tile_group.render($(parent));

  if (beestat.setting('visualize.heat_map_type') === 'absolute') {
    const min_max_container = document.createElement('div');
    min_max_container.style.marginTop = `${beestat.style.size.gutter}px`;
    parent.appendChild(min_max_container);

    const min = new beestat.component.input.text()
      .set_maxlength('5')
      .set_requirements({
        'type': 'decimal',
        'required': true
      })
      .set_value(
        beestat.temperature(beestat.setting(
          'visualize.heat_map_absolute.' + beestat.setting('visualize.data_type') + '.min'
        ))
      )
      .set_width(50);
    min.addEventListener('change', function() {
      if (min.meets_requirements() === true) {
        beestat.setting(
          'visualize.heat_map_absolute.' + beestat.setting('visualize.data_type') + '.min',
          beestat.temperature({
            'temperature': min.get_value(),
            'input_temperature_unit': beestat.setting('temperature_unit'),
            'output_temperature_unit': '°F'
          })
        );
      } else {
        min.set_value(
          beestat.temperature(beestat.setting(
            'visualize.heat_map_absolute.' + beestat.setting('visualize.data_type') + '.min'
          ))
        );
      }
    });

    const max = new beestat.component.input.text()
      .set_maxlength('5')
      .set_requirements({
        'type': 'decimal',
        'required': true
      })
      .set_value(
        beestat.temperature(beestat.setting(
          'visualize.heat_map_absolute.' + beestat.setting('visualize.data_type') + '.max'
        ))
      )
      .set_width(50);
    max.addEventListener('change', function() {
      if (max.meets_requirements() === true) {
        beestat.setting(
          'visualize.heat_map_absolute.' + beestat.setting('visualize.data_type') + '.max',
          beestat.temperature({
            'temperature': max.get_value(),
            'input_temperature_unit': beestat.setting('temperature_unit'),
            'output_temperature_unit': '°F'
          })
        );
      } else {
        max.set_value(
          beestat.temperature(beestat.setting(
            'visualize.heat_map_absolute.' + beestat.setting('visualize.data_type') + '.max'
          ))
        );
      }
    });

    let span;

    span = document.createElement('span');
    span.style.display = 'inline-block';
    min.render($(span));
    parent.appendChild(span);

    span = document.createElement('span');
    span.innerText = 'to';
    Object.assign(span.style, {
      'display': 'inline-block',
      'margin-left': `${beestat.style.size.gutter}px`,
      'margin-right': `${beestat.style.size.gutter}px`
    });
    parent.appendChild(span);

    span = document.createElement('span');
    span.style.display = 'inline-block';
    max.render($(span));
    parent.appendChild(span);

    span = document.createElement('span');
    switch (beestat.setting('visualize.data_type')) {
    case 'temperature':
      span.innerText = beestat.setting('temperature_unit');
      break;
    case 'occupancy':
      span.innerText = '%';
      break;
    }

    Object.assign(span.style, {
      'display': 'inline-block',
      'margin-left': `${beestat.style.size.gutter}px`
    });
    parent.appendChild(span);
  }
};

/**
 * Decorate the type options.
 *
 * @param {HTMLDivElement} parent
 */
beestat.component.card.visualize_settings.prototype.decorate_time_period_ = function(parent) {
  const self = this;

  (new beestat.component.title('Time Period')).render($(parent));

  const color = beestat.style.color.purple.base;

  const tile_group = new beestat.component.tile_group();

  // Current Day
  const current_day_tile = new beestat.component.tile()
    .set_background_hover_color(color)
    .set_text_color('#fff')
    .set_icon('calendar')
    .set_text('Today');

  if (
    beestat.setting('visualize.range_type') === 'dynamic' &&
    beestat.setting('visualize.range_dynamic') === 0
  ) {
    current_day_tile.set_background_color(color);
  } else {
    current_day_tile
      .set_background_color(beestat.style.color.bluegray.light)
      .addEventListener('click', function() {
        beestat.cache.delete('data.three_d__runtime_sensor');
        beestat.setting('visualize.range_type', 'dynamic');
        beestat.setting('visualize.range_dynamic', 0);
        self.rerender();
      });
  }
  tile_group.add_tile(current_day_tile);

  // Yesterday
  const yesterday_tile = new beestat.component.tile()
    .set_background_hover_color(color)
    .set_text_color('#fff')
    .set_icon('calendar')
    .set_text('Yesterday');

  if (
    beestat.setting('visualize.range_type') === 'dynamic' &&
    beestat.setting('visualize.range_dynamic') === 1
  ) {
    yesterday_tile.set_background_color(color);
  } else {
    yesterday_tile
      .set_background_color(beestat.style.color.bluegray.light)
      .addEventListener('click', function() {
        beestat.cache.delete('data.three_d__runtime_sensor');
        beestat.setting('visualize.range_type', 'dynamic');
        beestat.setting('visualize.range_dynamic', 1);
        self.rerender();
      });
  }
  tile_group.add_tile(yesterday_tile);

  // Current Week
  const week_tile = new beestat.component.tile()
    .set_background_hover_color(color)
    .set_text_color('#fff')
    .set_icon('calendar_week')
    .set_text('7 Day Average');

  if (
    beestat.setting('visualize.range_type') === 'dynamic' &&
    beestat.setting('visualize.range_dynamic') === 7
  ) {
    week_tile.set_background_color(color);
  } else {
    week_tile
      .set_background_color(beestat.style.color.bluegray.light)
      .addEventListener('click', function() {
        beestat.cache.delete('data.three_d__runtime_sensor');
        beestat.setting('visualize.range_type', 'dynamic');
        beestat.setting('visualize.range_dynamic', 7);
        self.rerender();
      });
  }
  tile_group.add_tile(week_tile);

  // Custom
/*  const custom_tile = new beestat.component.tile()
    .set_background_hover_color(color)
    .set_text_color('#fff')
    .set_icon('calendar_edit')
    .set_text('Custom');

  if (
    beestat.setting('visualize.range_type') === 'static'
  ) {
    custom_tile.set_background_color(color);
  } else {
    custom_tile
      .set_background_color(beestat.style.color.bluegray.light)
      .addEventListener('click', function() {
        // TODO MODAL
        beestat.setting('visualize.range_type', 'static');
        self.rerender();
      });
  }
  tile_group.add_tile(custom_tile);*/

  tile_group.render($(parent));
};

/**
 * Get the title of the card.
 *
 * @return {string} The title of the card.
 */
beestat.component.card.visualize_settings.prototype.get_title_ = function() {
  return 'Visualize Settings';
};

/**
 * Decorate the menu.
 *
 * @param {rocket.Elements} parent
 */
/*beestat.component.card.visualize_settings.prototype.decorate_top_right_ = function(parent) {
  var menu = (new beestat.component.menu()).render(parent);

  menu.add_menu_item(new beestat.component.menu_item()
    .set_text('Help')
    .set_icon('help_circle')
    .set_callback(function() {
      // TODO
      // window.open('https://doc.beestat.io/596040eadd014928830b4d1d54692761');
    }));
};
*/