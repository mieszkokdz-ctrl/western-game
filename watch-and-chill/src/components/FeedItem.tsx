import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import CommentsSheet from './CommentsSheet';
import CreatorProfileSheet from './CreatorProfileSheet';
import ModerationSheet from './ModerationSheet';
import { useComments } from '../context/CommentsContext';
import { useLikes } from '../context/LikesContext';
import { useShares } from '../context/SharesContext';
import type { Title } from '../data/catalog';
import { colors } from '../theme/colors';

type Props = {
  title: Title;
  active: boolean;
  height: number;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}tys.`;
  return String(n);
}

export default function FeedItem({ title, active, height }: Props) {
  const { isLiked, toggleLike } = useLikes();
  const liked = isLiked(title.id);
  const { getComments } = useComments();
  const commentCount = getComments(title.id).length;
  const { getShareCount, incrementShare } = useShares();
  const shareCount = title.shares + getShareCount(title.id);
  const [moderationVisible, setModerationVisible] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [creatorProfileVisible, setCreatorProfileVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const player = useVideoPlayer(title.videoUrl, p => {
    p.loop = true;
    // Start muted: browsers block autoplay with sound until the user interacts,
    // which would otherwise leave every video stuck on the first frame.
    p.muted = true;
  });

  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  useEffect(() => {
    if (active) {
      // Always start from the beginning rather than resuming wherever a
      // previous scroll-away left it paused.
      player.currentTime = 0;
      player.play();
      setPaused(false);
    } else {
      player.pause();
    }
  }, [active, player]);

  const togglePlayback = () => {
    if (player.playing) {
      player.pause();
      setPaused(true);
    } else {
      player.play();
      setPaused(false);
    }
  };

  const handleShare = async () => {
    if (Platform.OS !== 'web') return;
    const shareData = {
      title: 'Watch&Chill',
      text: `${title.author}: ${title.caption}`,
      url: window.location.href,
    };
    // Counted as soon as the user opens the share sheet / copies the link,
    // rather than waiting on confirmation that it actually completed —
    // browsers are inconsistent about resolving that promise reliably.
    incrementShare(title.id);
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled — the share was still counted, matching how most apps do this.
      }
      return;
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1800);
      } catch {
        // Clipboard access denied — nothing more we can do.
      }
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <VideoView
        player={player}
        style={[StyleSheet.absoluteFill, styles.video]}
        nativeControls={false}
        contentFit="cover"
        playsInline
      />
      {/* expo-video's VideoView doesn't forward touch-responder props to its
          underlying native <video> element, so wrapping it directly in
          TouchableWithoutFeedback never receives taps. A separate transparent
          layer on top reliably captures them instead. */}
      <TouchableWithoutFeedback onPress={togglePlayback}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      {paused && (
        <View style={styles.pauseOverlay} pointerEvents="none">
          {/* Built from plain bars instead of the ⏸ emoji, since some Android
              fonts render that codepoint as a solid orange emoji glyph. */}
          <View style={styles.pauseIconBar} />
          <View style={styles.pauseIconBar} />
        </View>
      )}

      {linkCopied && (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>Link skopiowany</Text>
        </View>
      )}

      <View style={styles.rightRail} pointerEvents="box-none">
        <TouchableWithoutFeedback onPress={() => setCreatorProfileVisible(true)} testID="creator-avatar-button">
          <View style={styles.avatarWrap}>
            <Image source={require('../../assets/icon.png')} style={styles.avatar} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => toggleLike(title.id)}>
          <View style={styles.railItem}>
            <Text style={[styles.railIcon, liked && { color: colors.primary }]}>{liked ? '❤️' : '🤍'}</Text>
            <Text style={styles.railLabel}>{formatCount(title.likes + (liked ? 1 : 0))}</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setCommentsVisible(true)} testID="comment-button">
          <View style={styles.railItem}>
            <Text style={styles.railIcon}>💬</Text>
            <Text style={styles.railLabel}>{formatCount(commentCount)}</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={handleShare} testID="share-button">
          <View style={styles.railItem}>
            <Text style={styles.railIcon}>↗️</Text>
            <Text style={styles.railLabel}>{formatCount(shareCount)}</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setModerationVisible(true)} testID="moderation-menu-button">
          <View style={styles.railItem}>
            <Text style={styles.railIcon}>⋯</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setMuted(m => !m)} testID="mute-button">
          <View style={styles.railItem}>
            <Text style={styles.railIcon}>{muted ? '🔇' : '🔊'}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.bottomInfo} pointerEvents="none">
        <Text style={styles.author}>{title.author}</Text>
        <Text style={styles.caption} numberOfLines={2}>
          {title.caption}
        </Text>
      </View>

      <ModerationSheet title={title} visible={moderationVisible} onClose={() => setModerationVisible(false)} />
      <CommentsSheet title={title} visible={commentsVisible} onClose={() => setCommentsVisible(false)} />
      <CreatorProfileSheet
        author={title.author}
        visible={creatorProfileVisible}
        onClose={() => setCreatorProfileVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pauseIconBar: {
    width: 16,
    height: 56,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  toast: {
    position: 'absolute',
    top: '45%',
    left: 40,
    right: 40,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toastText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  rightRail: {
    position: 'absolute',
    right: 12,
    bottom: 90,
    alignItems: 'center',
    gap: 22,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#FFD60A',
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  railItem: {
    alignItems: 'center',
  },
  railIcon: {
    fontSize: 30,
  },
  railLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  bottomInfo: {
    paddingHorizontal: 16,
    paddingRight: 80,
    paddingBottom: 24,
  },
  author: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  caption: {
    color: colors.text,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 19,
  },
});
