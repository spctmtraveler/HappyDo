FROM php:7.4-apache

# Install mysqli and pdo_mysql for MySQL connections
RUN docker-php-ext-install mysqli pdo_mysql && docker-php-ext-enable mysqli pdo_mysql

# Enable Apache mod_rewrite for URL rewrites and mod_headers for .htaccess
RUN a2enmod rewrite headers

# Update the default apache site with the config we created.
ADD apache-config.conf /etc/apache2/sites-enabled/000-default.conf

# By default, simply start apache.
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]