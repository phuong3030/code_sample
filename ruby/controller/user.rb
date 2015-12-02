module API
  module V1
    class User < Grape::API

      include API::V1::Defaults
      include Grape::Rails::Cache
      helpers API::Auth

      before do
        authenticated_user
      end

      resource :user do
        desc 'User profile and user attributes'
        get '/:id' do
          get_user.get_data(params[:type])
        end

        desc 'Post current user avatar'
        post '/:id' do
          user = get_user
          avatar = AvatarUploader.new(id: user.user_profile.id)
          avatar.store!(params[:avatar])
          user.user_profile.update_attribute('avatar', avatar)

          { avatar: avatar.url }
        end

        desc 'Put current user profile'
        put '/:id' do
          user = get_user

          # If password is empty, we won't update password
          if params[:password].present? 
            if params[:password] == params[:password_confirmation]
              if user.update_attributes(user_params)
                user.get_data('summary')
              else
                error!({ 
                  status: 400,
                  message: "Can't update user profile.",
                  errors: user.errors
                }, 400)
              end
            else
              # Password doesn't match with password confirmation
              error!({ 
                status: 400, 
                message: "Password and password confirmation didn't match.",
                errors: ['Wrong param']
              }, 400)

            end
          else
            if user.update_attributes(user_params_without_password)
              user.get_data('summary')
            else
              error!({ 
                status: 400,
                message: "Can't update user profile.",
                errors: user.errors
              }, 400)
            end
          end
        end

        desc 'Get navbar of current user by his roles'
        get '/:id/ui' do
          get_user.group.get_func_by_role(params[:type])
        end

        desc 'Get user notifications'
        get '/:id/notifications' do 
          quantity, page = params[:quantity].to_i, params[:page].to_i

          if quantity > 0 && quantity < 20
            current_user.mailbox.notifications.first(quantity)
          elsif quantity == 0
            if page > 0
              current_user.mailbox.notifications.page(page).per(25)
            else
              error!({ 
                status: 400, 
                message: "Invalid params",
                errors: ['Wrong page param']
              }, 400)
            end
          else
            error!({ 
                status: 400, 
                message: "Invalid params",
                errors: ['Wrong quantity param']
              }, 400)
          end
        end
      end

      helpers do
        def get_user
          params[:id] == 'current' ? current_user : Admin::User.includes(:user_profile, :user_attributes).find(params[:id])
        end

        def user_params
          ActionController::Parameters.new(params).permit(
            :username,
            :password,
            :email,
            user_profile_attributes: [
              :firstname, 
              :lastname, 
              :phone, 
              :birthday, 
              :title,
              :bio,
              :interest,
              :country
            ]
          )
        end

        def user_params_without_password
          ActionController::Parameters.new(params).permit(
            :username,
            :email,
            user_profile_attributes: [
              :firstname, 
              :lastname, 
              :phone, 
              :birthday, 
              :title,
              :bio,
              :interest,
              :country
            ]
          )
        end
      end
    end
  end
end
