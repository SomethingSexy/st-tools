FROM node:16 as base

# Add a new user to run the application in 
RUN useradd --create-home --shell /bin/bash app

# Directories to run the application
RUN mkdir -p /opt/st/data && \
    chown app: -R /opt/st

# Switch to the working directory
WORKDIR /opt/st

# Switch to the user
USER app

COPY --chown=app package.json package-lock.json /opt/st/
COPY --chown=app ./src /opt/st/src
COPY --chown=app ./.swcrc /opt/st/.swcrc
# add back when we are building for a true prod docker image
# COPY --chown=app ./node_modules /opt/st/node_modules

# This could get moved behind a dev env flag, instead we would copy the 
# the modules folder instead
# We need to install to this environment because swc installs based on os
RUN npm ci
RUN npm run build

CMD ["npm", "start"]