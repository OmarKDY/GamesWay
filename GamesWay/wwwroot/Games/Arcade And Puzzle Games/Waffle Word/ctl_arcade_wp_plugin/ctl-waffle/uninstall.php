<?php
    global $wpdb;

    $wpdb->query( "DELETE FROM " . $wpdb->prefix .
        "ctl_arcade_games WHERE game_plugin_dir = 'ctl-waffle'");
    $wpdb->query( "DELETE FROM " . $wpdb->prefix .
        "ctl_arcade_scores WHERE game_plugin_dir = 'ctl-waffle'");
    $wpdb->query( "DELETE FROM " . $wpdb->prefix .
        "ctl_arcade_ratings WHERE game_plugin_dir = 'ctl-waffle'");

    delete_option('ctl-waffle_do_activation_redirect');