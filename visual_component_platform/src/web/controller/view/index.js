module.exports = class extends think.Controller {
    platformAction() {
        this.assign('prefix', this.config('platformPrefix', undefined, 'web').replace(/\/$/, ''));
        return this.display();
    }
};
