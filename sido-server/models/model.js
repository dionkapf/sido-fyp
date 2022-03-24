const pool = require("./db");

class Model {
  constructor(table) {
    this.pool = pool;
    this.table = table;
    this.results = {};
    this.pool.on(
      "error",
      (err, client) => `Error, ${err}, on idle client${client}`
    );
  }

  async select(columns, clause = "", values = [], join_clauses = []) {
    let query = {
      text: `SELECT ${columns} FROM ${this.table}`,
      values: values,
    };

    if (join_clauses) {
      join_clauses.forEach((join_clause) => {
        query.text += " " + join_clause;
      });
    }
    if (clause) query.text += " " + clause;
    console.log(query);
    return this.pool.query(query);
  }

  async insert(columns, values) {
    if (columns.length !== values.length) throw error;
    let values_string = this.placeHolderTextMaker(values);
    let query = {
      text: `INSERT INTO ${
        this.table
      } (${columns.join()}) VALUES (${values_string.join()}) RETURNING *`,
      values: values,
    };
    return this.pool.query(query);
  }

  placeHolderTextMaker(values) {
    let values_string = [];
    for (let i = 1; i < values.length + 1; i++) values_string.push(`$${i}`);
    return values_string;
  }
}

module.exports.Model = Model;
