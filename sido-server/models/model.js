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

  async update(columns, values, id) {
    if (columns.length !== values.length)
      throw console.error("Values and columns do not match");
    let query = {
      text: `UPDATE ${this.table} SET ${this.updateColumns(
        columns,
        values
      )} WHERE id = $1 RETURNING *`,
      values: [...id, ...values],
    };
    console.log(query);
    return this.pool.query(query);
  }

  async insert(columns, values) {
    if (columns.length !== values.length)
      throw console.error("Values and columns do not match");
    let values_string = this.placeHolderTextMaker(values);
    let query = {
      text: `INSERT INTO ${
        this.table
      } (${columns.join()}) VALUES (${values_string.join()}) RETURNING *`,
      values: values,
    };
    console.log(query);
    return this.pool.query(query);
  }

  async delete(column, value) {
    let query = {
      text: `DELETE FROM ${this.table} WHERE ${column} = $1`,
      values: value,
    };
    console.log(query);
    return this.pool.query(query);
  }

  placeHolderTextMaker(values, start = 1) {
    let values_string = [];
    for (let i = 1; i < values.length + 1; i++)
      values_string.push(`$${i + (start - 1)}`);
    return values_string;
  }

  updateColumns(columns, values) {
    let values_string = this.placeHolderTextMaker(values, 2);
    let clause = "";
    columns.forEach((column, index) => {
      if (index === 0) {
        clause += `${column} = ${values_string[index]}`;
      } else {
        clause += `, ${column} = ${values_string[index]}`;
      }
    });
    return clause;
  }
}

module.exports.Model = Model;
