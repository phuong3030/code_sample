require 'rails_helper'

describe Admin::User, :type => :model do

  context 'association and index' do
    it { should belong_to(:group) }
    it { should belong_to(:company) }
    it { should have_db_index(:email) }
    it { should have_db_index(:group_id) }
    it { should have_db_index(:company_id) }
    it { should have_db_index(:reset_password_token) }
    it { should have_many(:user_attributes) }
    it { should have_one(:user_profile) }
    it{ should accept_nested_attributes_for :user_profile }
    it{ should accept_nested_attributes_for :user_attributes }
  end

  context "validators" do
    let(:no_name_user) { 
      FactoryGirl.build(
        :user, 
        email: 'aga'
      ) 
    }
    subject { no_name_user }

    it { should validate_presence_of(:email) }
    it { should allow_value('admin@email.com').for(:email) }
    it { should validate_uniqueness_of(:email) }
    it { should validate_uniqueness_of(:username) }
  end

  context 'has right instance method' do
    let!(:user) { FactoryGirl.create(:user) }
    subject { user }

    it 'has right fullname' do
      user.fullname.should == user.user_profile.firstname + ' ' + user.user_profile.lastname
    end

    it 'can generate basic data' do
      expect(user.get_data('basic')).to eq({
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        avatar: user.user_profile.avatar
      })
    end

    it 'can generate summary data' do
      expect(user.get_data('summary')).to eq({
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        created_at: user.created_at.strftime('%b %d, %Y'),
        user_profile_attributes: user.user_profile,
        user_attribute_attributes: user.user_attributes,
        notifications: user.mailbox.notifications.first(25)
      })
    end

    it 'can generate dashboard data' do
      user.group.stub(:get_func_by_role)

      expect(user.get_data('dashboard')).to eq({
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        avatar: user.user_profile.avatar.url(:small),
        navbars: user.group.get_func_by_role('sidebars'),
        notifications: user.mailbox.notifications.first(5)
      })
    end

    it 'can generate normal model' do
      expect(user.get_data).to eq({
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        created_at: user.created_at.strftime('%b %d, %Y'),
        user_profile_attributes: user.user_profile,
        user_attribute_attributes: user.user_attributes,
        notifications: user.mailbox.notifications.first(25)
      })
    end
  end

  context 'mailboxer setting' do
    let(:user) { FactoryGirl.create(:user) }
    subject { user }

    it 'choose email method when receive notification' do
      subject.mailboxer_email(Mailboxer::Notification.new).should be_nil 
    end

    it 'does nothing when receive message' do
      subject.mailboxer_email(Mailboxer::Message.new).should be_nil 
    end
  end


end
