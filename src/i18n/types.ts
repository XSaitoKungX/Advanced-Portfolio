export interface Translations {
  nav: {
    home: string;
    about: string;
    skills: string;
    projects: string;
    experience: string;
    contact: string;
    guestbook: string;
    login: string;
    logout: string;
    admin: string;
  };
  home: {
    greeting: string;
    name: string;
    roles: string[];
    description: string;
    cta_projects: string;
    cta_contact: string;
    terminal: {
      boot: string;
      loading_modules: string;
      connecting: string;
      ready: string;
      session_start: string;
      fetching: string;
      portfolio_ready: string;
      menu_projects: string;
      menu_skills: string;
      menu_contact: string;
      cmd1: string;
      cmd2: string;
      cmd3: string;
      cmd4: string;
      cmd5: string;
      menu_hint: string;
      menu_experience: string;
      menu_about: string;
      cmd_help_title: string;
      cmd_projects_title: string;
      cmd_skills_title: string;
      cmd_contact_title: string;
      cmd_experience_title: string;
      cmd_about_title: string;
      cmd_about_age: string;
      cmd_about_status: string;
      cmd_whoami_title: string;
      cmd_whoami_role: string;
      cmd_whoami_company: string;
      cmd_whoami_location: string;
      cmd_ping_title: string;
      cmd_ping_sending: string;
      cmd_ping_result: string;
      cmd_date_title: string;
      cmd_stack_title: string;
      cmd_astra_title: string;
      cmd_clear_title: string;
      cmd_navigate: string;
      cmd_not_found: string;
      cmd_try_help: string;
    };
    scroll: string;
  };
  about: {
    title: string;
    subtitle: string;
    description1: string;
    description2: string;
    stats: {
      age: string;
      experience: string;
      servers: string;
      graduation: string;
    };
    values: {
      title: string;
      clean_code: string;
      clean_code_desc: string;
      performance: string;
      performance_desc: string;
      design: string;
      design_desc: string;
      learning: string;
      learning_desc: string;
    };
    download_cv: string;
  };
  skills: {
    title: string;
    subtitle: string;
    note: string;
    categories: {
      frontend: string;
      backend: string;
      devops: string;
      tools: string;
    };
  };
  projects: {
    title: string;
    subtitle: string;
    filter_all: string;
    view_demo: string;
    view_code: string;
    view_details: string;
    status: {
      completed: string;
      in_progress: string;
      planned: string;
    };
    no_results: string;
  };
  experience: {
    title: string;
    subtitle: string;
    present: string;
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    form: {
      name: string;
      name_placeholder: string;
      email: string;
      email_placeholder: string;
      subject: string;
      subject_placeholder: string;
      message: string;
      message_placeholder: string;
      submit: string;
      submitting: string;
      success_title: string;
      success_message: string;
      error_title: string;
      error_message: string;
    };
    info: {
      email: string;
      location: string;
      availability: string;
      available: string;
    };
    social: string;
  };
  auth: {
    login_with_discord: string;
    logging_in: string;
    logout_confirm: string;
    welcome_back: string;
    admin_area: string;
    unauthorized: string;
    unauthorized_desc: string;
    public_login_title: string;
    public_login_desc: string;
    profile_access: string;
    guestbook_verified: string;
    go_to_profile: string;
    back_to_home: string;
  };
  guestbook: {
    title: string;
    subtitle: string;
    description: string;
    sign_with_discord: string;
    sign_anonymous: string;
    name_placeholder: string;
    email_placeholder: string;
    message_placeholder: string;
    submit: string;
    submitting: string;
    success_title: string;
    success_message: string;
    no_entries: string;
    first_entry: string;
    verified_badge: string;
    pending_badge: string;
    anonymous: string;
    time_just_now: string;
    time_minutes_ago: string;
    time_hours_ago: string;
    time_days_ago: string;
    characters_left: string;
  };
  common: {
    loading: string;
    error: string;
    back: string;
    close: string;
    open: string;
    read_more: string;
    language: string;
  };
  meta: {
    title: string;
    description: string;
  };
}
