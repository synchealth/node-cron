'use strict';

const tickInterval = 1000 * 5; //5 seconds in milliseconds

module.exports = (function() {

  /**
   * Creates a new scheduled task.
   *
   * @param {Task} task - task to schedule.
   * @param {boolean} immediateStart - whether to start the task immediately.
   */
  function ScheduledTask(task, immediateStart) {
    const tasks = [task]
    this.tasks = tasks
    this.task = function() {
      const now = new Date();
      tasks.forEach(function(eachTask) {
        eachTask.update(now)
      });
    };

    this.tick = null;

    if (immediateStart !== false) {
      this.start();
    }
  }
  
  ScheduledTask.prototype.addTask = function(task) {
    this.tasks.push(task)
  }

  /**
   * Starts updating the task.
   *
   * @returns {ScheduledTask} instance of this task.
   */
  ScheduledTask.prototype.start = function() {
    if (this.task && !this.tick) {
      this.tick = setTimeout(this.onTick.bind(this), tickInterval);
    }
    return this;
  };
  
  ScheduledTask.prototype.onTick = function() {
    this.task()
    this.tick = setTimeout(this.onTick.bind(this), tickInterval);
  }

  /**
   * Stops updating the task.
   *
   * @returns {ScheduledTask} instance of this task.
   */
  ScheduledTask.prototype.stop = function() {
    if (this.tick) {
      clearTimeout(this.tick);
      this.tick = null;
    }

    return this;
  };

  /**
   * Destoys the scheduled task.
   */
  ScheduledTask.prototype.destroy = function() {
    this.stop();

    this.task = null;
  };

  return ScheduledTask;
}());
