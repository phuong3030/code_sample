module Admin
  class User < ActiveRecord::Base
    acts_as_messageable

    belongs_to :group, class_name: 'Admin::Group'
    belongs_to :company, class_name: 'Admin::Company'
    has_one :user_profile, class_name: 'Admin::User::UserProfile'
    has_many :user_attributes, class_name: 'Admin::User::UserAttribute'

    accepts_nested_attributes_for :user_profile, :user_attributes, update_only: true

    devise :database_authenticatable, 
      :recoverable, :rememberable, :trackable, :validatable

    validates_presence_of :email
    validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, message: 'Wrong email format'
    validates_uniqueness_of :email, :username

    delegate :company_id, to: :company, allow_nil: true
    delegate :option_types_by_page, to: :company, allow_nil: true
    delegate :option_types, to: :company, allow_nil: true

    def fullname
      user_profile.try(:firstname) + ' ' + user_profile.try(:lastname)
    end

    def mailboxer_email(object)
      case object
      when Mailboxer::Message
        return nil
      when Mailboxer::Notification
        return nil
      end
    end

    def get_data(type = '')
      if type.present? 
        self.send(type.to_sym)
      else
        summary
      end
    end

    private 
    def basic
      {
        id: id,
        username: username,
        email: email,
        fullname: fullname,
        avatar: user_profile.avatar
      }
    end

    def summary
      {
        id: id,
        username: username,
        email: email,
        fullname: fullname,
        created_at: created_at.strftime('%b %d, %Y'),
        user_profile_attributes: user_profile,
        user_attribute_attributes: user_attributes,
        notifications: mailbox.notifications.first(25)
      }
    end

    def dashboard
      {
        id: id,
        username: username,
        email: email,
        fullname: fullname,
        avatar: user_profile.avatar.url(:small),
        navbars: group.get_func_by_role('sidebars'),
        notifications: mailbox.notifications.first(5)
      }
    end
  end
end
