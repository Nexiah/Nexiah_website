import type { Schema, Struct } from '@strapi/strapi';

export interface AutomationAutomation extends Struct.ComponentSchema {
  collectionName: 'components_automation_automations';
  info: {
    displayName: 'Automation';
  };
  attributes: {
    Automation: Schema.Attribute.Blocks;
  };
}

export interface ChallengeChallenge extends Struct.ComponentSchema {
  collectionName: 'components_challenge_challenges';
  info: {
    displayName: 'Challenge';
  };
  attributes: {
    Challenge: Schema.Attribute.Blocks;
  };
}

export interface NavigationNavigation extends Struct.ComponentSchema {
  collectionName: 'components_navigation_navigations';
  info: {
    displayName: 'navigation';
  };
  attributes: {};
}

export interface ResultResult extends Struct.ComponentSchema {
  collectionName: 'components_result_results';
  info: {
    displayName: 'Result';
  };
  attributes: {
    Result: Schema.Attribute.Blocks;
  };
}

export interface SectionArgument extends Struct.ComponentSchema {
  collectionName: 'components_section_arguments';
  info: {
    displayName: 'argument';
  };
  attributes: {
    argument_list: Schema.Attribute.Component<'section.argument-section', true>;
    description_section: Schema.Attribute.Text;
    title_section: Schema.Attribute.String;
  };
}

export interface SectionArgumentSection extends Struct.ComponentSchema {
  collectionName: 'components_section_argument_sections';
  info: {
    displayName: 'argument_section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon_name: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionDescriptionExpertise extends Struct.ComponentSchema {
  collectionName: 'components_section_description_expertises';
  info: {
    displayName: 'description_expertise';
  };
  attributes: {};
}

export interface SectionDescriptionSection extends Struct.ComponentSchema {
  collectionName: 'components_section_description_sections';
  info: {
    displayName: 'description_section';
  };
  attributes: {};
}

export interface SectionExpertise extends Struct.ComponentSchema {
  collectionName: 'components_section_expertise';
  info: {
    displayName: 'expertise';
  };
  attributes: {
    description_section: Schema.Attribute.Text;
    expertise_list: Schema.Attribute.Component<'section.expertises', true>;
    title_section: Schema.Attribute.String;
  };
}

export interface SectionExpertises extends Struct.ComponentSchema {
  collectionName: 'components_section_expertises';
  info: {
    displayName: 'expertises';
  };
  attributes: {
    description_expertise: Schema.Attribute.Text;
    icon_name: Schema.Attribute.String;
    icon_pic: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title_expertise: Schema.Attribute.String;
  };
}

export interface SectionHero extends Struct.ComponentSchema {
  collectionName: 'components_section_heroes';
  info: {
    displayName: 'hero';
  };
  attributes: {
    cta_text: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionStep extends Struct.ComponentSchema {
  collectionName: 'components_section_steps';
  info: {
    displayName: 'step';
  };
  attributes: {
    description_section: Schema.Attribute.Text;
    step_list: Schema.Attribute.Component<'section.steps-timeline', true>;
    title_section: Schema.Attribute.String;
  };
}

export interface SectionStepsTimeline extends Struct.ComponentSchema {
  collectionName: 'components_section_steps_timelines';
  info: {
    displayName: 'steps_timeline';
  };
  attributes: {
    description_step: Schema.Attribute.Text;
    icon_name: Schema.Attribute.String;
    title_step: Schema.Attribute.String;
  };
}

export interface SectionTitleExpertise extends Struct.ComponentSchema {
  collectionName: 'components_section_title_expertises';
  info: {
    displayName: 'title_expertise';
  };
  attributes: {
    description_expertise: Schema.Attribute.Text;
    icon_name: Schema.Attribute.String;
    icon_pic: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title_expertise: Schema.Attribute.String;
  };
}

export interface SectionTitleSection extends Struct.ComponentSchema {
  collectionName: 'components_section_title_sections';
  info: {
    displayName: 'title_section';
  };
  attributes: {};
}

export interface SectionToolList extends Struct.ComponentSchema {
  collectionName: 'components_section_tool_lists';
  info: {
    displayName: 'tool_list';
  };
  attributes: {
    icon_name: Schema.Attribute.String;
    icon_pic: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    tool_name: Schema.Attribute.String;
  };
}

export interface SectionTools extends Struct.ComponentSchema {
  collectionName: 'components_section_tools';
  info: {
    displayName: 'Tools';
  };
  attributes: {
    description_section: Schema.Attribute.Text;
    title_section: Schema.Attribute.String;
    tools_list: Schema.Attribute.Component<'section.tools-list', true>;
  };
}

export interface SectionToolsList extends Struct.ComponentSchema {
  collectionName: 'components_section_tools_lists';
  info: {
    displayName: 'tools_list';
  };
  attributes: {
    icon_name: Schema.Attribute.String;
    icon_pic: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    tool_name: Schema.Attribute.String;
  };
}

export interface SolutionSolution extends Struct.ComponentSchema {
  collectionName: 'components_solution_solutions';
  info: {
    displayName: 'Solution';
  };
  attributes: {
    Solution: Schema.Attribute.Blocks;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'automation.automation': AutomationAutomation;
      'challenge.challenge': ChallengeChallenge;
      'navigation.navigation': NavigationNavigation;
      'result.result': ResultResult;
      'section.argument': SectionArgument;
      'section.argument-section': SectionArgumentSection;
      'section.description-expertise': SectionDescriptionExpertise;
      'section.description-section': SectionDescriptionSection;
      'section.expertise': SectionExpertise;
      'section.expertises': SectionExpertises;
      'section.hero': SectionHero;
      'section.step': SectionStep;
      'section.steps-timeline': SectionStepsTimeline;
      'section.title-expertise': SectionTitleExpertise;
      'section.title-section': SectionTitleSection;
      'section.tool-list': SectionToolList;
      'section.tools': SectionTools;
      'section.tools-list': SectionToolsList;
      'solution.solution': SolutionSolution;
    }
  }
}
