var Cate = function(data, parent){
    this.data = data;
    this.parent = parent;
    this.extend = false;
    this.children = [];
}

Cate.prototype.show = function(){
    if (!this.div) {
        var div = $("<div class='cate'></div>");
        var img = "<img width='128' height='128' src='" + this.data.image + "' />";
        div.html(img + this.data.name);
        this.indent = this.parent ? this.parent.indent + 20 : 20;
        div.css("margin-left", this.indent);

        var self = this;
        div.css("cursor", "pointer");
        div.click(function(){
            self.toggle.call(self);
        });
        this.div = div;

        if (this.parent) {
            this.parent.div.after(this.div);
        } else {
            $("#menu").append(this.div);
        }
    }
    if (this.extend) {
        this.extend = false;
        this.toggle();
    }
    this.div.hide().slideDown('fast');
}

Cate.prototype.hide = function() {
    $(this.children).each(this.hide);
    this.div.slideUp('fast');
}

Cate.prototype.toggle = function(){
    var self = this;
    if (!self.extend) {
        self.div.addClass("extended");
        var children = self.data.subcategories.length ?
            self.data.subcategories : self.data.items;
        if (self.children.length) {
            $(self.children).each(function(){
                this.show();
            });
        } else {
            $(children).each(function(){
                var sub_data = this,
                child = sub_data.questions ?
                    new Item(sub_data, self) : new Cate(sub_data, self);
                child.show();
                self.children[self.children.length] = child;
            });
        }
    } else {
        this.div.removeClass("extended");
        $(self.children).each(function(){
            this.hide();
        });
    }
    this.extend = !this.extend;
}

var Item = function(data, parent) {
    this.data = data;
    this.parent = parent;
    this.extend = false;
    this.children = [];
}

Item.prototype.show = function() {
    if (!this.div) {
        var div = $("<div class='item'></div>");
        var img = "<img width='128' height='128' src='" + this.data.image + "' />";
        div.html(img + this.data.name);
        this.indent = this.parent ? this.parent.indent + 20 : 20;
        div.css("margin-left", this.indent);

        if (this.data.questions.length) {
            var self = this;
            div.css("cursor", "pointer");
            div.click(function(){
                self.toggle.call(self);
            });
        }
        this.div = div;
        this.parent.div.after(this.div);
    }
    if (this.extend) {
        this.extend = false;
        this.toggle();
    }
    this.div.hide().slideDown('fast');
}

Item.prototype.toggle = function() {
    var self = this;
    if (!this.extend) {
        this.div.addClass("extended-item");
        if (self.children.length) {
            $(self.children).each(Question.prototype.show);
        } else {
            $(this.data.questions).each(function(){
                var child = new Question(this, self);
                child.show();
                self.children[self.children.length] = child;
            });
        }
    } else {
        this.div.removeClass("extended-item");
        $(self.children).each(function(){
            this.hide();
        });
    }
    this.extend = !this.extend;
}

Item.prototype.hide = Cate.prototype.hide;

var Question = function(data, parent) {
    this.data = data;
    this.parent = parent;
    this.extend = false;
    this.children = [];
}

Question.prototype.show = function() {
    if (!this.div) {
        var div = $("<div class='question'></div>");
        div.html("<div class='name'>" + this.data.name + "</div>");
        this.indent = this.parent ? this.parent.indent + 20 : 20;
        div.css("margin-left", this.indent);

        var choice_div = $("<div class='chosen'></div>");
        choice_div.text(this.choice ? this.choice.name : "<not chosen>");
        div.append(choice_div);

        var self = this;
        div.css("cursor", "pointer");
        div.click(function(){
            self.toggle.call(self);
        });

        this.div = div;
        this.choice_div = choice_div;
        this.parent.div.after(this.div);
    }
    if (this.extend) {
        this.extend = false;
        this.toggle();
    }
    this.div.hide().slideDown('fast');
}

Question.prototype.toggle = function() {
    var self = this;
    if (!self.extend) {
        self.div.addClass("extended-question");
        if (self.children.length) {
            $(self.children).each(function() {
                this.select(self.chosen_id === this.data.id).show();
            });
        } else {
            $(self.data.modifiers).each(function() {
                var choice = new Choice(this, self);
                choice.show();
                choice.div.click(function(){
                    self.chosen_id = choice.data.id;
                    self.choice_div.text(choice.data.name);
                    $(self.children).each(function(){
                        this.select(false);
                    });
                    choice.select(true);
                });
                self.children[self.children.length] = choice;
            });
        }

    } else {
        self.div.removeClass("extended-question");
        $(self.children).each(Choice.prototype.hide);
    }
    this.extend = !this.extend;
}

Question.prototype.hide = Cate.prototype.hide;

var Choice = function(data, parent) {
    this.data = data;
    this.parent = parent;
}

Choice.prototype.show = function() {
    if (!this.div) {
        var div = $("<div class='choice'></div>");
        div.html(this.data.name);
        this.indent = this.parent ? this.parent.indent + 20 : 20;
        div.css("margin-left", this.indent);
        this.div = div;
        this.parent.div.after(this.div);
    }
    this.div.hide().slideDown('fast');
}

Choice.prototype.select = function(do_select) {
    if (do_select) {
        this.div.addClass("selected");
    } else {
        this.div.removeClass("selected");
    }
    return this;
}

Choice.prototype.hide = function() {
    this.div.slideUp("fast");
}
