const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Image = require('stremio/common/Image');
const Multiselect = require('stremio/common/Multiselect');
const PlayIconCircleCentered = require('stremio/common/PlayIconCircleCentered');
const useBinaryState = require('stremio/common/useBinaryState');
const useDataset = require('stremio/common/useDataset');
const styles = require('./styles');

const ICON_FOR_TYPE = Object.assign(Object.create(null), {
    'movie': 'ic_movies',
    'series': 'ic_series',
    'channel': 'ic_channels',
    'tv': 'ic_tv',
    'other': 'ic_movies'
});

const MetaItem = React.memo(({ className, type, name, poster, posterShape, playIcon, progress, menuOptions, onSelect, menuOptionOnSelect, ...props }) => {
    const dataset = useDataset(props);
    const [menuOpen, onMenuOpen, onMenuClose] = useBinaryState(false);
    const metaItemOnClick = React.useCallback((event) => {
        if (!event.nativeEvent.selectMetaItemPrevented && typeof onSelect === 'function') {
            onSelect({
                type: 'select',
                dataset: dataset,
                reactEvent: event,
                nativeEvent: event.nativeEvent
            });
        }
    }, [onSelect, dataset]);
    const multiselectOnClick = React.useCallback((event) => {
        event.nativeEvent.selectMetaItemPrevented = true;
    }, []);
    const multiselectOnSelect = React.useCallback((event) => {
        if (typeof menuOptionOnSelect === 'function') {
            menuOptionOnSelect({
                type: 'select-option',
                dataset: dataset,
                reactEvent: event.reactEvent,
                nativeEvent: event.nativeEvent
            });
        }
    }, [menuOptionOnSelect, dataset]);
    return (
        <Button className={classnames(className, styles['meta-item-container'], styles['poster-shape-poster'], styles[`poster-shape-${posterShape}`], { 'active': menuOpen })} title={name} onClick={metaItemOnClick}>
            <div className={styles['poster-container']}>
                <div className={styles['poster-image-layer']}>
                    <Image
                        className={styles['poster-image']}
                        src={poster}
                        alt={' '}
                        renderFallback={() => (
                            <Icon
                                className={styles['placeholder-icon']}
                                icon={typeof ICON_FOR_TYPE[type] === 'string' ? ICON_FOR_TYPE[type] : ICON_FOR_TYPE['other']}
                            />
                        )}
                    />
                </div>
                {
                    playIcon ?
                        <div className={styles['play-icon-layer']}>
                            <PlayIconCircleCentered className={styles['play-icon']} />
                        </div>
                        :
                        null
                }
                {
                    progress > 0 ?
                        <div className={styles['progress-bar-layer']}>
                            <div className={styles['progress-bar']} style={{ width: `${Math.min(progress, 1) * 100}%` }} />
                        </div>
                        :
                        null
                }
            </div>
            {
                (typeof name === 'string' && name.length > 0) || (Array.isArray(menuOptions) && menuOptions.length > 0) ?
                    <div className={styles['title-bar-container']}>
                        {
                            typeof name === 'string' && name.length > 0 ?
                                <div className={styles['title-label']}>{name}</div>
                                :
                                null
                        }
                        {
                            Array.isArray(menuOptions) && menuOptions.length > 0 ?
                                <div className={styles['multiselect-container']} onClick={multiselectOnClick}>
                                    <Multiselect
                                        className={styles['multiselect-label-container']}
                                        renderLabelContent={() => (
                                            <Icon className={styles['icon']} icon={'ic_more'} />
                                        )}
                                        options={menuOptions}
                                        onOpen={onMenuOpen}
                                        onClose={onMenuClose}
                                        onSelect={multiselectOnSelect}
                                    />
                                </div>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
        </Button>
    );
});

MetaItem.displayName = 'MetaItem';

MetaItem.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    poster: PropTypes.string,
    posterShape: PropTypes.oneOf(['poster', 'landscape', 'square']),
    playIcon: PropTypes.bool,
    progress: PropTypes.number,
    menuOptions: PropTypes.array,
    onSelect: PropTypes.func,
    menuOptionOnSelect: PropTypes.func
};

module.exports = MetaItem;
