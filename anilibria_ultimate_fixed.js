(function(plugin){
    plugin.id = "anilibria_ultimate";
    plugin.name = "Anilibria Ultimate";
    plugin.version = "1.0";

    plugin.init = function(){
        Lampa.Manifest.extensions.push({
            component: 'anilibria_ultimate',
            name: 'Anilibria Ultimate',
            author: 'Behaud',
            description: 'Просмотр аниме с Anilibria.tv',
            version: '1.0'
        });

        Lampa.Component.add('anilibria_ultimate', {
            create: function(){
                let scroll = new Lampa.Scroll({ mask: true });
                let items = [];

                function load(){
                    Lampa.Api.call('https://api.anilibria.tv/v2/title/search?limit=20&order_by=rating&direction=desc', function(data){
                        if(!data || !data.list) return;

                        data.list.forEach(function(item){
                            const title = item.names.ru || item.names.en || item.code;
                            const description = item.description || 'Нет описания';
                            const poster = 'https://static-libria.weekstorm.one/' + item.posters.original.url;
                            const playerLink = item.player?.host + item.player?.list?.['0']?.['0']?.hls;

                            items.push({
                                title: title,
                                original_title: item.names.en,
                                description: description,
                                poster: poster,
                                url: playerLink || '',
                                onClick: function(){
                                    if (playerLink) {
                                        Lampa.Player.play({
                                            url: playerLink,
                                            title: title
                                        });
                                    } else {
                                        Lampa.Noty.show('Ссылка для воспроизведения не найдена');
                                    }
                                }
                            });
                        });

                        scroll.append(items);
                    }, function(error){
                        Lampa.Noty.show('Ошибка при получении данных с Anilibria');
                    });
                }

                load();

                this.render = function(){
                    return scroll.render();
                };
            }
        });
    };

    plugin.run = function(){
        Lampa.Manifest.extensions.push({
            component: 'anilibria_ultimate',
            name: 'Anilibria Ultimate',
            author: 'Behaud',
            description: 'Просмотр аниме с Anilibria.tv',
            version: '1.0'
        });

        Lampa.Activity.push({
            component: 'anilibria_ultimate',
            name: 'Anilibria Ultimate',
            type: 'anime',
            url: '',
            search_on: true
        });
    };
})(this);
