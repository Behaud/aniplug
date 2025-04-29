(function(plugin){
    plugin.id = "anilibria_ultimate";
    plugin.name = "Anilibria Ultimate";
    plugin.version = "1.2";

    plugin.init = function(){
        Lampa.Manifest.extensions.push({
            component: 'anilibria_ultimate',
            name: 'Anilibria Ultimate',
            author: 'Твой Ник',
            description: 'Полный доступ к Anilibria.tv: поиск, фильтры, выбор серий и качества',
            version: '1.2'
        });

        Lampa.Component.add('anilibria_ultimate', {
            create: function(){
                let scroll = new Lampa.Scroll({ mask: true });
                let items = [];
                let query = '';
                let filters = [
                    { title: 'Рейтинг', sort: 'rating' },
                    { title: 'Сезон (зима 2024)', season: '2024', season_code: 'winter' },
                    { title: 'Дата выхода', sort: 'updated' },
                    { title: 'Оценка', sort: 'shikimori_rating' }
                ];

                let nav = new Lampa.NavigationMenu({
                    title: 'Anilibria Фильтр',
                    items: filters.map((f, i) => ({ title: f.title, index: i })),
                    onSelect: function(index){
                        query = '';
                        let selected = filters[index];
                        load(selected);
                    }
                });

                function load(filter){
                    scroll.clear();
                    items = [];

                    let url = 'https://api.anilibria.tv/v2/title/search?limit=30';
                    
                    if (filter.sort) url += '&order_by=' + filter.sort + '&direction=desc';
                    if (filter.season && filter.season_code) {
                        url += `&season_year=${filter.season}&season_code=${filter.season_code}`;
                    }

                    if (query.length >= 2) {
                        url += `&search=${encodeURIComponent(query)}`;
                    }

                    Lampa.Api.call(url, function(data){
                        if (!data || !data.list) {
                            Lampa.Noty.show('Ничего не найдено');
                            return;
                        }

                        data.list.forEach(function(item){
                            const title = item.names.ru || item.names.en || item.code;
                            const description = item.description || 'Нет описания';
                            const poster = 'https://static-libria.weekstorm.one' + item.posters.original.url;

                            items.push({
                                title: title,
                                original_title: item.names.en,
                                description: description,
                                poster: poster,
                                onClick: function(){
                                    openPlayer(item);
                                }
                            });
                        });

                        scroll.append(items);
                    }, function(error){
                        Lampa.Noty.show('Ошибка при получении данных с Anilibria');
                    });
                }

                function openPlayer(item){
                    const playlist = item.player?.list || {};

                    if (!playlist || Object.keys(playlist).length === 0) {
                        Lampa.Noty.show('Серии не найдены');
                        return;
                    }

                    let series = [];

                    Object.keys(playlist).forEach(season => {
                        Object.keys(playlist[season]).forEach(episode => {
                            const hls = playlist[season][episode].hls;
                            const mp4 = playlist[season][episode].mp4?.['720'] || playlist[season][episode].mp4?.['480'];
                            const link = hls || mp4;

                            if (link) {
                                series.push({
                                    title: `Серия ${episode}`,
                                    url: item.player.host + link
                                });
                            }
                        });
                    });

                    if (series.length === 1) {
                        Lampa.Player.play({
                            url: series[0].url,
                            title: item.names.ru || item.names.en
                        });
                    } else {
                        Lampa.Select.show({
                            title: 'Выбери серию',
                            items: series.map(s => ({ title: s.title, url: s.url })),
                            onSelect: function(s){
                                Lampa.Player.play({
                                    url: s.url,
                                    title: s.title
                                });
                            }
                        });
                    }
                }

                this.search = function(value){
                    query = value;
                    load({});
                };

                load(filters[0]);

                this.render = function(){
                    return Lampa.Arrays.join([nav.render(), scroll.render()]);
                };
            }
        });
    };

    plugin.run = function(){
        Lampa.Activity.push({
            component: 'anilibria_ultimate',
            name: 'Anilibria Ultimate',
            type: 'anime',
            url: '',
            search_on: true
        });
    };
})(this);
